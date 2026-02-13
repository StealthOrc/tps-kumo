import { type FormEvent, useEffect, useId, useState } from "react";
import type { WsSub } from "@/lib/api";
import type { External, Message } from "@/lib/types";
import { rand_range, rand_tps } from "@/lib/utils";

export default function TPSInserter({ ws }: { ws: WsSub | null }) {
	const [tps, setTps] = useState<number>(rand_tps());
	const [interval, setInterval] = useState<number>(10);
	const [mspt, setMspt] = useState<number>(rand_range(0, 1));
	const tpsId = useId();
	const msptId = useId();
	const intervalId = useId();

	useEffect(() => {
		ws?.on("open", () => console.log("WS opened"));

		return () => {
			ws?.close();
		};
	}, [ws]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const message: Message = {
			tpsData: [
				{
					worldName: "default",
					worldUUID: "1bcb661a-5522-4f5e-89d4-e68d18fc37aa",
					time: new Date().toISOString(),
					tpsMstpMap: {
						[interval]: [tps, 0],
					},
				},
				{
					worldName: "another",
					worldUUID: "509027b4-eb88-4c6a-a910-6a512ec801ba",
					time: new Date().toISOString(),
					tpsMstpMap: {
						[interval]: [tps, 0],
					},
				},
			],
		} as External.AddHytaleTps;
		console.log(
			new Date().toISOString(),
			"sending message:",
			JSON.stringify(message),
		);
		ws?.send(message);
		setTps(rand_tps());
		setInterval(interval);
	};

	return (
		<form
			className="hytale-card flex flex-col p-4 gap-4 max-w-md"
			onSubmit={handleSubmit}
		>
			<span
				className="text-center font-semibold pb-2 border-b"
				style={{
					borderColor: "var(--hytale-border)",
					color: "var(--hytale-text)",
				}}
			>
				Test Add TPS
			</span>
			<div
				id={`formContent-${useId()}`}
				className="flex flex-wrap gap-4 items-end"
			>
				<div className="flex flex-col gap-1">
					<label
						htmlFor={tpsId}
						className="text-sm"
						style={{ color: "var(--hytale-text-muted)" }}
					>
						TPS
					</label>
					<input
						id={tpsId}
						className="hytale-input px-3 py-2 w-24"
						name="tps"
						type="number"
						value={tps}
						onChange={(e) => setTps(Number(e.target.value))}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label
						htmlFor={msptId}
						className="text-sm"
						style={{ color: "var(--hytale-text-muted)" }}
					>
						MSPT
					</label>
					<input
						id={msptId}
						className="hytale-input px-3 py-2 w-24"
						name="mspt"
						type="number"
						value={mspt}
						onChange={(e) => setMspt(Number(e.target.value))}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label
						htmlFor={intervalId}
						className="text-sm"
						style={{ color: "var(--hytale-text-muted)" }}
					>
						Interval (s)
					</label>
					<input
						id={intervalId}
						className="hytale-input px-3 py-2 w-24"
						name="interval"
						type="number"
						value={interval}
						onChange={(e) => setInterval(Number(e.target.value))}
					/>
				</div>
			</div>
			<button
				type="submit"
				className="hytale-btn px-4 py-2 cursor-pointer font-medium w-fit"
				style={{
					borderColor: "var(--hytale-accent)",
					color: "var(--hytale-accent)",
				}}
			>
				Send
			</button>
		</form>
	);
}
