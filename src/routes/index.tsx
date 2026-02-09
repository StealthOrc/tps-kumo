import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import {
	type Dispatch,
	type SetStateAction,
	StrictMode,
	useEffect,
	useRef,
	useState,
} from "react";
import Tps from "@/components/tps";
import TPSInserter from "@/components/tps/TpsInserter";
import WorldSection from "@/components/tps/WorldSection";
import TpsHistory from "@/components/tpsHistory";
import { getTPS, type getTPSType } from "@/data/tps";
import { env } from "@/env";
import { createWebSocket, type WsMessageEvent, type WsSub } from "@/lib/api";
import { Internal } from "@/lib/types";
import { TPS } from "@/lib/utils";

export const Route = createFileRoute("/")({
	errorComponent: ({ error }) => <pre>{JSON.stringify(error, null, 2)}</pre>,
	pendingComponent: () => <div>Loading home…</div>,
	component: App,
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

function App() {
	const [tpsArr, setTpsArr] = useState<TpsState>({ tpsData: {} });
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
				<div className="flex flex-1 flex-col gap-2 overflow-auto w-full">
					{Object.entries(tpsArr.tpsData).map((worldList) => {
						return (
							<WorldSection key={worldList[0]} world={worldList[1].worldName}>
								{Object.entries(worldList[1].intervalData).map((interval) => {
									return (
										<TpsHistory
											interval={Number(interval[0])}
											key={`${worldList[1].worldName}-${interval[0]}`}
										>
											{" "}
											{interval[1].map((tps) => (
												<Tps {...tps} key={tps.time}></Tps>
											))}
										</TpsHistory>
									);
								})}
							</WorldSection>
						);
					})}
				</div>
				<TPSInserter {...{ ws: ws.current, useTPSType: false }} />
			</div>
		</StrictMode>
	);
}
