import { FormEvent, useEffect, useRef, useState } from "react";
import { chatWs, type WsSub } from "@/lib/api";
import { Message } from "@/server/ws";

export default function TPSInserter({ ws }: { ws: WsSub | null }) {
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		ws?.on("open", () => console.log("WS opened"));

		return () => {
			ws?.close();
		};
	}, [ws]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const message: Message = { id: crypto.randomUUID(), message: input };
		console.log("sending message:", message);
		ws?.send(message);
		setInput("");
	};

	return (
		<form
			className="flex flex-col border-2 border-white text-white"
			onSubmit={handleSubmit}
		>
			<input
				className="bg-white text-black"
				type="text"
				value={input}
				onChange={(event) => setInput(event.target.value)}
			></input>
			<button type="submit">send</button>
		</form>
	);
}
