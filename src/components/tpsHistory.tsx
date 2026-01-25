import type { getTPSType, TPS } from "@/data/tps";
import Tps from "./tps";

export default function TpsHistory({
	title,
	tps,
}: {
	title: string;
	tps: getTPSType | null;
}) {
	return (
		<div className="border-4 border-[hsl(224,15%,20%)] bg-[hsl(212,30%,18%)] rounded-a px-4 py-2">
			<div className="flex gap-1 items-center pb-1">
				<p>{title}</p>
				<hr className="flex-1 border-t border-gray-300 dark:border-gray-700 rounded-2xl m-0 ml-2" />
			</div>
			<div className="flex gap-4">
				{tps?.then((tps) => {
					return tps.map((t: TPS) => <Tps key={t.id} tps={t} />);
				})}
			</div>
		</div>
	);
}
