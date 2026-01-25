// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/server/ws";
import { chatWs } from "../lib/api";

export function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");

	const sub = useRef<ReturnType<typeof chatWs.subscribe> | null>(null);

	useEffect(() => {
		sub.current = chatWs.subscribe();
		console.log(new Date().toISOString(), " current sub:", sub?.current);
		sub.current.subscribe((event) => {
			console.log("received message:", event.data);
			//console.log("current chat messages", messages);
			setMessages((prev) => [...prev, event.data as Message]);
		});
		sub.current.on("open", () => console.log("WS opened"));
		sub.current.on("close", () => console.log("WS closed"));

		return () => {
			sub.current?.close();
		};
	}, []);

	const unsubscribe = () => {
		console.log("WS closing...");
		sub.current?.close();
	};

	// ----- send message -----
	const send = () => {
		if (!input) return;
		console.log("sending input:", input);
		sub.current?.send({ id: Math.random() * 10000, message: input }); // typed!
		setInput("");
	};

	return (
		<div className="p-4 flex flex-col">
			<h2>🦊 Elysia WebSocket Chat</h2>

			<div
				style={{
					border: ".25rem solid #000000",
					height: "200px",
					overflowY: "auto",
					padding: "0.5rem",
					marginBottom: "0.5rem",
				}}
			>
				{messages.map((m) => (
					<div key={crypto.randomUUID()}>
						<strong> {m.id} </strong>
						<small> {m.message} </small>
					</div>
				))}
			</div>

			<div className="flex flex-0">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="type something…"
					onKeyDown={(e) => e.key === "Enter" && send()}
					className="flex-1 border-2 border-black"
				/>
				<button type="button" onClick={send} className="ml-2 flex-0">
					Send
				</button>
				<button type="button" onClick={unsubscribe} className="ml-2 flex-0">
					unsub
				</button>
			</div>
		</div>
	);
}
