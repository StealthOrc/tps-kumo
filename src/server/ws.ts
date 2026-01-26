import { Elysia } from "elysia";
import { z } from "zod";
import { db } from "@/db";
import { tps } from "@/db/schema";
import { rand_tps } from "@/lib/utils";

export const tpsSchema = z.object({
	id: z.uuid(),
	tps: z.int(),
	timestamp: z.iso.datetime(),
});
export type TPS = z.infer<typeof tpsSchema>;

export const messageSchema = tpsSchema;
export type Message = z.infer<typeof messageSchema>;

export const ws = new Elysia().ws("/ws", {
	// these are the definitions of our websocket message type
	body: messageSchema,
	response: messageSchema,
	open(ws) {
		console.log(new Date().toISOString(), " sending welcome message...");
		ws.send({
			id: crypto.randomUUID(),
			tps: rand_tps(),
			timestamp: new Date().toISOString(),
		});
	},
	message(ws, message) {
		console.log("message received, now sending:", message);
		db.insert(tps)
			.values({
				uuid: message.id,
				timestamp: new Date(message.timestamp),
				tps: message.tps,
				world: "696cb4f1-a06a-451d-ad04-fc6f70e3a99b",
			})
			.then((value) => {
				ws.send(message);
			});
	},
	close() {
		console.log("client left");
	},
});
