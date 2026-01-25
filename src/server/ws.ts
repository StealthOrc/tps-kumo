import { Elysia, t } from "elysia";

export const message = t.Object({
	id: t.Number(),
	message: t.String(),
});
export type Message = (typeof message)["static"];

export const ws = new Elysia().ws("/ws", {
	// these are the definitions of our websocket message type
	body: message,
	response: message,
	open(ws) {
		console.log(new Date().toISOString(), " sending welcome message...");
		ws.send({ id: Math.random() * 10000, message: "Welcome!" });
	},
	message(ws, message) {
		console.log("message received, now sending:", message);
		ws.send(message);
	},
	close() {
		console.log("client left");
	},
});
