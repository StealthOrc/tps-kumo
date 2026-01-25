import type { TPS } from "@/server/ws";

export default function Tps({ tps }: { tps: TPS }) {
	return (
		<span
			className={`${
				tps.tps > 5
					? tps.tps > 15
						? "hover:bg-green-500 bg-green-600"
						: "hover:bg-orange-500 bg-orange-600"
					: "hover:bg-red-500 bg-red-600"
			} 
            h-15 w-7 rounded-xl`}
			key={tps.id}
			data-tps={tps.tps}
		/>
	);
}
