import { createFileRoute } from "@tanstack/react-router";
import TpsHistory from "@/components/tpsHistory";
import { getTPS } from "@/data/tps";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const tps = getTPS();
	return (
		<div className="flex flex-col p-5 gap-4 items-center min-h-screen bg-[hsl(216,31.3%,12.5%)] text-white">
			<div className="bg-[hsl(214,43%,21%)] border-4 border-[hsl(224,15%,20%)] rounded-sm p-2">
				<h1 className="text-6xl text-center">TPS Kumo</h1>
				<p className="text-xl px-2">
					TPS Kumo is a tool for monitoring TPS of a Hytale Server.
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<TpsHistory title="10s" tps={tps} />
				<TpsHistory title="5min" tps={tps} />
				<TpsHistory title="10min" tps={tps} />
			</div>
		</div>
	);
}
