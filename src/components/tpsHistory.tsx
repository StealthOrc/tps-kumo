import { useEffect } from "react";
import type { getTPSType } from "@/data/tps";
import type { WsSub } from "@/lib/api";
import { addTpsSchema, type TPS } from "@/lib/types";
import Tps from "./tps";

export default function TpsHistory({
	interval,
	tps,
	setTps,
	ws,
}: {
	interval: number;
	tps: Awaited<getTPSType>;
	setTps: any;
	ws: WsSub | null;
}) {
	useEffect(() => {
		ws?.subscribe((event) => {
			console.log(
				"got event:",
				event,
				" now stringified: ",
				JSON.stringify(event.data),
			);
			const tpsParse = addTpsSchema.safeParse(event.data);
			if (!tpsParse.success) {
				console.error(
					"Cannot add to TPSHistory, got unknown message:",
					tpsParse.error,
					event.data,
					JSON.stringify(event.data),
				);
				return;
			}
			console.log(
				"tpsparsedata msptmap:",
				tpsParse.data.tpsMstpMap,
				interval.toString(),
				tpsParse.data.tpsMstpMap[interval],
			);
			if (!tpsParse.data.tpsMstpMap[interval]) return;
			setTps([
				{
					id: crypto.randomUUID(),
					tps: tpsParse.data.tpsMstpMap[interval][0],
					timestamp: tpsParse.data.time,
				} as TPS,
				...tps,
			]);
		});
		return () => {
			ws?.close;
		};
	});
	return (
		<div className="border-4 border-[hsl(224,15%,20%)] bg-[hsl(212,30%,18%)] rounded-a px-4 py-2">
			<div className="flex gap-1 items-center pb-1">
				<p>{interval}s</p>
				<hr className="flex-1 border-t border-gray-300 dark:border-gray-700 rounded-2xl m-0 ml-2" />
			</div>
			<div className="flex gap-4">
				{tps?.map((t) => (
					<Tps key={t.id} tps={t} />
				))}
			</div>
		</div>
	);
}
