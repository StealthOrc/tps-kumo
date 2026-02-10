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
	pendingComponent: () => <div>Loading home…</div>,
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
			<div className="flex flex-col p-5 gap-4 items-center min-h-screen bg-[hsl(216,31.3%,12.5%)] text-white overflow-auto">
				<div className="bg-[hsl(214,43%,21%)] border-4 border-[hsl(224,15%,20%)] rounded-sm p-2">
					<h1 className="text-6xl text-center">TPS Kumo</h1>
					<p className="text-xl px-2">
						TPS Kumo is a tool for monitoring TPS of a Hytale Server.
					</p>
				</div>
				<nav className="border border-[hsl(224,15%,20%)] p-2">
					<ol>
						<Link className="hover:underline" {...linkOptions({ to: "/" })}>
							Home
						</Link>
					</ol>
				</nav>
				<nav className="border border-[hsl(224,15%,20%)] p-2 flex gap-0.5">
					{worldsLinks.map(({ id, worldUuid, worldName }) => (
						<button
							key={id}
							className="hover:underline cursor-pointer hover:bg-[hsl(212,30%,18%)] p-2 rounded-sm"
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
				</nav>
				<nav className="border border-[hsl(224,15%,20%)] p-2 flex gap-0.5">
					{intervalsLinks.map(({ id, intervalKey, displayLabel }) => (
						<button
							key={id}
							className="hover:underline cursor-pointer hover:bg-[hsl(212,30%,18%)] p-2 rounded-sm"
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
				</nav>
				<div className="flex flex-1 flex-col gap-2 overflow-auto w-full">
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
