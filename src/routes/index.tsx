import {
	createFileRoute,
	Link,
	linkOptions,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import {
	type Dispatch,
	type SetStateAction,
	StrictMode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import z from "zod";
import Tps from "@/components/tps";
import TPSInserter from "@/components/tps/TpsInserter";
import WorldSection from "@/components/tps/WorldSection";
import TpsHistory from "@/components/tpsHistory";
import { getTPS, type getTPSType } from "@/data/tps";
import { env } from "@/env";
import { createWebSocket, type WsMessageEvent, type WsSub } from "@/lib/api";
import { Internal } from "@/lib/types";
import { TPS } from "@/lib/utils";

const routeParams = z.object({
	world: z.string().optional(),
	interval: z.string().optional(),
});

export const Route = createFileRoute("/")({
	errorComponent: ({ error }) => <pre>{JSON.stringify(error, null, 2)}</pre>,
	pendingComponent: () => (
		<div className="flex items-center justify-center min-h-[200px]" style={{ color: "var(--hytale-text-muted)" }}>
			Loading…
		</div>
	),
	component: App,
	validateSearch: (search) => routeParams.parse(search),
});

type TpsState = Awaited<getTPSType>;

function applyTpsPointMap(
	prev: TpsState,
	tpsPointMap: Internal.TPSPointMap,
): TpsState {
	const next: TpsState = { ...prev };

	for (const [worldUUID, worldEntry] of Object.entries(tpsPointMap.tpsData)) {
		const prevWorld = next.tpsData[worldUUID];
		const mergedWorld = prevWorld
			? {
					worldName: worldEntry.worldName ?? prevWorld.worldName,
					intervalData: { ...prevWorld.intervalData },
				}
			: {
					worldName: worldEntry.worldName,
					intervalData: {} as Record<string, Internal.TPSPoint[]>,
				};

		for (const [intervalKey, points] of Object.entries(
			worldEntry.intervalData,
		)) {
			const arr = [...(mergedWorld.intervalData[intervalKey] ?? [])];
			for (const point of points) {
				const { index, found } = TPS.findInsertIndex(arr, point.time);
				console.log(
					`findInsertIndex: ${worldEntry.worldName} - ${index}:${found} point:`,
					point,
					arr,
				);
				if (found) {
					arr[index] = point;
				} else {
					arr.splice(index, 0, point);
				}
			}
			mergedWorld.intervalData[intervalKey] = arr;
		}

		next.tpsData[worldUUID] = mergedWorld;
	}

	return next;
}

function handleWsMessage(setTpsArr: Dispatch<SetStateAction<TpsState>>) {
	return (event: WsMessageEvent) => {
		const parse = Internal.tpsPointMapSchema.safeParse(event.data);
		if (!parse.success) return;

		setTpsArr((prev) => applyTpsPointMap(prev, parse.data));
	};
}

type LinkDef = { id: string; worldUuid: string; worldName: string };
type IntervalLinkDef = { id: string; intervalKey: string; displayLabel: string };

const ALL_WORLDS = "ALL";
const ALL_INTERVALS = "ALL";

function App() {
	const { world: selectedWorldUuid, interval: selectedIntervalKey } = useSearch({
		from: Route.fullPath,
	});
	const [tpsArr, setTpsArr] = useState<TpsState>({ tpsData: {} });
	const worldsLinks = useMemo<LinkDef[]>(() => {
		const result: LinkDef[] = Object.entries(tpsArr.tpsData).map(
			([worldUuid, { worldName }]) => ({
				id: worldUuid,
				worldUuid,
				worldName,
			}),
		);
		result.unshift({ id: "ALL", worldUuid: ALL_WORLDS, worldName: ALL_WORLDS });
		return result;
	}, [tpsArr.tpsData]);
	const intervalsLinks = useMemo<IntervalLinkDef[]>(() => {
		const intervalKeys = new Set<string>();
		const entries = Object.entries(tpsArr.tpsData);
		const worldsToScan =
			selectedWorldUuid && selectedWorldUuid !== ALL_WORLDS
				? entries.filter(([uuid]) => uuid === selectedWorldUuid)
				: entries;
		for (const [, worldEntry] of worldsToScan) {
			for (const key of Object.keys(worldEntry.intervalData)) {
				intervalKeys.add(key);
			}
		}
		const result: IntervalLinkDef[] = [...intervalKeys]
			.sort((a, b) => Number(a) - Number(b))
			.map((intervalKey) => ({
				id: intervalKey,
				intervalKey,
				displayLabel: `${intervalKey}s`,
			}));
		result.unshift({
			id: "ALL",
			intervalKey: ALL_INTERVALS,
			displayLabel: ALL_INTERVALS,
		});
		return result;
	}, [tpsArr.tpsData, selectedWorldUuid]);
	const navigate = useNavigate({ from: Route.fullPath });
	const ws = useRef<WsSub | null>(null);
	useEffect(() => {
		getTPS().then((value) => setTpsArr(value));
		console.log(
			new Date().toISOString(),
			"creating websocket: ",
			env.VITE_BACKEND_URL,
		);
		ws.current = createWebSocket(env.VITE_BACKEND_URL).subscribe();
		ws.current.subscribe(handleWsMessage(setTpsArr));
		//TODO: When coming from another page back to home, we seem to do this request 3x!?
		return () => {
			ws.current?.close();
		};
	}, []);
	return (
		<StrictMode>
			<div className="flex flex-col min-h-screen overflow-auto" style={{ backgroundColor: "var(--hytale-bg)", color: "var(--hytale-text)" }}>
				{/* Hero / header - Hytale-style banner */}
				<header className="hytale-card mx-4 mt-6 mb-2 px-6 py-8 text-center max-w-4xl w-full self-center">
					<h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2" style={{ color: "var(--hytale-text)" }}>
						TPS Kumo
					</h1>
					<p className="text-lg" style={{ color: "var(--hytale-text-muted)" }}>
						Monitor TPS of your Hytale server in real time.
					</p>
				</header>

				{/* Main nav bar */}
				<nav className="hytale-card mx-4 mb-3 px-4 py-2 max-w-4xl w-full self-center flex flex-wrap items-center gap-2">
					<Link
						className="hytale-btn px-4 py-2 no-underline"
						{...linkOptions({ to: "/" })}
					>
						Home
					</Link>
				</nav>

				{/* World filter */}
				<nav className="mx-4 mb-2 max-w-4xl w-full self-center">
					<p className="text-sm mb-1.5" style={{ color: "var(--hytale-text-muted)" }}>World</p>
					<div className="flex flex-wrap gap-1.5">
						{worldsLinks.map(({ id, worldUuid, worldName }) => (
							<button
								key={id}
								className={`hytale-btn px-3 py-1.5 text-sm cursor-pointer ${selectedWorldUuid === worldUuid ? "hytale-btn-active" : ""}`}
								type="button"
								onClick={() =>
									navigate({
										search: { world: worldUuid, interval: selectedIntervalKey },
										replace: true,
									})
								}
							>
								{worldName}
							</button>
						))}
					</div>
				</nav>

				{/* Interval filter */}
				<nav className="mx-4 mb-4 max-w-4xl w-full self-center">
					<p className="text-sm mb-1.5" style={{ color: "var(--hytale-text-muted)" }}>Interval</p>
					<div className="flex flex-wrap gap-1.5">
						{intervalsLinks.map(({ id, intervalKey, displayLabel }) => (
							<button
								key={id}
								className={`hytale-btn px-3 py-1.5 text-sm cursor-pointer ${selectedIntervalKey === intervalKey ? "hytale-btn-active" : ""}`}
								type="button"
								onClick={() =>
									navigate({
										search: { world: selectedWorldUuid, interval: intervalKey },
										replace: true,
									})
								}
							>
								{displayLabel}
							</button>
						))}
					</div>
				</nav>

				<div className="flex flex-1 flex-col gap-4 overflow-auto w-full max-w-4xl self-center px-4 pb-6">
					{Object.entries(tpsArr.tpsData).map(([worldUuid, worldEntry]) => {
						// Only display the selected world; data for all worlds stays in tpsArr keeps updating
						return (
							<WorldSection
								className={`${
									selectedWorldUuid &&
									worldUuid !== selectedWorldUuid &&
									selectedWorldUuid !== ALL_WORLDS
										? "hidden"
										: ""
								}`}
								key={worldUuid}
								world={worldEntry.worldName}
							>
								{Object.entries(worldEntry.intervalData).map(
									([intervalKey, points]) => {
										// Only display the selected interval; data for all intervals stays in tpsArr
										if (
											selectedIntervalKey &&
											selectedIntervalKey !== ALL_INTERVALS &&
											intervalKey !== selectedIntervalKey
										)
											return null;
										return (
											<TpsHistory
												interval={Number(intervalKey)}
												key={`${worldEntry.worldName}-${intervalKey}`}
											>
												{points.map((tps) => (
													<Tps {...tps} key={tps.time} />
												))}
											</TpsHistory>
										);
									},
								)}
							</WorldSection>
						);
					})}
				</div>
				<TPSInserter {...{ ws: ws.current, useTPSType: false }} />
			</div>
		</StrictMode>
	);
}
