import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import { StrictMode, useEffect, useRef, useState } from "react";
import TPSInserter from "@/components/tps/TpsInserter";
import TpsHistory from "@/components/tpsHistory";
import { getTPS, type getTPSType } from "@/data/tps";
import { env } from "@/env";
import { createWebSocket, type WsSub } from "@/lib/api";

export const Route = createFileRoute("/")({
	errorComponent: ({ error }) => <pre>{JSON.stringify(error, null, 2)}</pre>,
	pendingComponent: () => <div>Loading home…</div>,
	component: App,
});

function App() {
	const [tps, setTps] = useState<Awaited<getTPSType>>([]);
	const ws = useRef<WsSub | null>(null);
	useEffect(() => {
		getTPS().then((value) => setTps(value));
		console.log(
			new Date().toISOString(),
			"creating websocket: ",
			env.VITE_BACKEND_URL,
		);
		ws.current = createWebSocket(env.VITE_BACKEND_URL).subscribe();
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
				<nav className="border-1 border-[hsl(224,15%,20%)] p-2">
					<ol>
						<Link className="hover:underline" {...linkOptions({ to: "/" })}>
							Home
						</Link>
					</ol>
				</nav>
				<div className="flex flex-col gap-2">
					<TpsHistory interval={10} tps={tps} setTps={setTps} ws={ws.current} />
					<TpsHistory interval={11} tps={tps} setTps={setTps} ws={ws.current} />
					{/*<TpsHistory title="10min" tps={tps} setTps={setTps} ws={ws.current} /> */}
				</div>
				<TPSInserter {...{ ws: ws.current, useTPSType: false }} />
			</div>
		</StrictMode>
	);
}
