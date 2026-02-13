import { useId } from "react";
import type { Internal } from "@/lib/types";

export default function Tps({ tps }: Internal.TPSPoint) {
	const barStyle =
		tps > 15
			? { backgroundColor: "var(--hytale-success)" }
			: tps > 5
				? { backgroundColor: "var(--hytale-warning)" }
				: { backgroundColor: "var(--hytale-danger)" };
	return (
		<span
			className="h-4 min-w-1 rounded-sm transition-opacity hover:opacity-90"
			style={{ ...barStyle, width: "8px" }}
			key={useId()}
			data-tps={tps}
			title={`TPS: ${tps}`}
		/>
	);
}
