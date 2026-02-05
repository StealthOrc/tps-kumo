import { type FormEvent, useEffect, useId, useState } from "react";
import type { WsSub } from "@/lib/api";
import type { AddTps, Message, TPS } from "@/lib/types";
import { rand_range, rand_tps } from "@/lib/utils";

export default function TPSInserter({
	ws,
	useTPSType,
}: {
	ws: WsSub | null;
	useTPSType: boolean;
}) {
	const [tps, setTps] = useState<number>(rand_tps());
	const [interval, setInterval] = useState<number>(10);
	const [mspt, setMspt] = useState<number>(rand_range(0, 1));

	useEffect(() => {
		ws?.on("open", () => console.log("WS opened"));

		return () => {
			ws?.close();
		};
	}, [ws]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const message: Message = useTPSType
			? ({
					id: crypto.randomUUID(),
					tps: tps,
					timestamp: new Date().toISOString(),
				} as TPS)
			: ({
					worldName: "default",
					worldUUID: "696cb4f1-a06a-451d-ad04-fc6f70e3a99b",
					time: new Date().toISOString(),
					tpsMstpMap: { [interval]: [tps, 0], [interval + 1]: [tps + 1, 1] },
				} as AddTps);
		console.log(
			new Date().toISOString(),
			"sending message:",
			JSON.stringify(message),
		);
		ws?.send(message);
		setTps(rand_tps());
		setInterval(10);
	};

	return (
		<form
			className="flex flex-col border-2 border-white text-white"
			onSubmit={handleSubmit}
		>
			<div id={`formContent-${useId()}`} className="flex gap-2 items-center">
				<div className="flex flex-col">
					<div className="flex flex-col">
						<label htmlFor="tps">TPS</label>
						<input
							className="bg-white text-black"
							name="tps"
							type="number"
							value={tps}
							onChange={(event) => setTps(Number(event.target.value))}
						></input>
					</div>
					<div className="flex flex-col">
						<label htmlFor="mspt">MSPT</label>
						<input
							className="bg-white text-black"
							name="mspt"
							type="number"
							value={mspt}
							onChange={(event) => setMspt(Number(event.target.value))}
						></input>
					</div>
				</div>
				<div className="flex flex-col">
					<label htmlFor="interval">Interval in [s]</label>
					<input
						className="bg-white text-black"
						name="interval"
						type="number"
						value={interval}
						onChange={(event) => setInterval(Number(event.target.value))}
					></input>
				</div>
			</div>
			<button type="submit" className="hover:bg-amber-400 hover:cursor-pointer">
				send
			</button>
		</form>
	);
}
