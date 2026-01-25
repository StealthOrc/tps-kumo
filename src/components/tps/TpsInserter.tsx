import { FormEvent, useEffect, useState } from "react";
import { type WsSub } from "@/lib/api";
import { rand_tps } from "@/lib/utils";
import { type Message } from "@/server/ws";

export default function TPSInserter({ ws }: { ws: WsSub | null }) {
	const [input, setInput] = useState<number>(rand_tps());

	useEffect(() => {
		ws?.on("open", () => console.log("WS opened"));

		return () => {
			ws?.close();
		};
	}, [ws]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const message: Message = {
			id: crypto.randomUUID(),
			tps: input,
			timestamp: new Date().toISOString(),
		};
		console.log("sending message:", message);
		ws?.send(message);
		setInput(rand_tps());
	};

	return (
		<form
			className="flex flex-col border-2 border-white text-white"
			onSubmit={handleSubmit}
		>
			<input
				className="bg-white text-black"
				type="number"
				value={input}
				onChange={(event) => setInput(Number(event.target.value))}
			></input>
			<button type="submit">send</button>
		</form>
	);
}
