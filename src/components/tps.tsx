import { useId } from "react";
import type { Internal } from "@/lib/types";

export default function Tps({ time, tps, mspt }: Internal.TPSPoint) {
	return (
		<span
			className={`${
				tps > 5
					? tps > 15
						? "hover:bg-green-500 bg-green-600"
						: "hover:bg-orange-500 bg-orange-600"
					: "hover:bg-red-500 bg-red-600"
			} 
            h-15 w-2 rounded-xs`}
			key={useId()}
			data-tps={tps}
		/>
	);
}
