import { Elysia } from "elysia";
import { z } from "zod";

export const message = z.object({
	id: z.uuid(),
	message: z.string(),
});
export type Message = z.infer<typeof message>;

export const ws = new Elysia().ws("/ws", {
	// these are the definitions of our websocket message type
	body: message,
	response: message,
	open(ws) {
		console.log(new Date().toISOString(), " sending welcome message...");
		ws.send({ id: crypto.randomUUID(), message: "Welcome!" });
	},
	message(ws, message) {
		console.log("message received, now sending:", message);
		ws.send(message);
	},
	close() {
		console.log("client left");
	},
});
