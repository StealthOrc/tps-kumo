import { Elysia } from "elysia";
import type { ElysiaWS } from "elysia/ws";
import { db } from "@/db";
import { tps as tpsTable, worlds } from "@/db/schema";
import {
	type AddTps,
	addTpsSchema,
	messageSchema,
	tpsSchema,
} from "@/lib/types";

export const ws = new Elysia().ws("/ws", {
	// these are the definitions of our websocket message type
	body: messageSchema,
	response: messageSchema,
	open(_ws) {
		console.log(new Date().toISOString(), "A client connected.");
	},
	message(ws, message) {
		console.log(
			new Date().toISOString(),
			"message received:",
			message,
			" now stringified: ",
			JSON.stringify(message),
		);
		const tpsProbe = tpsSchema.safeParse(message);
		if (tpsProbe.success) {
			console.log("test");
			const tps = tpsProbe.data;
			db.insert(tpsTable)
				.values({
					uuid: tps.id,
					timestamp: new Date(tps.timestamp),
					tps: tps.tps,
					world: "1bcb661a-5522-4f5e-89d4-e68d18fc37aa",
				})
				.then(() => {
					console.log(new Date().toISOString(), "got tpsProbe, sending:", tps);
					ws.send(tps);
				});
			return;
		}
		const addTpsProbe = addTpsSchema.safeParse(message);
		if (!addTpsProbe.success) return;

		const addTps = addTpsProbe.data;
		// insert world if we dont have it yet
		db.insert(worlds)
			.values({
				uuid: addTps.worldUUID,
				name: addTps.worldName,
			})
			.onConflictDoUpdate({
				target: worlds.uuid,
				set: { name: addTps.worldName },
			})
			.then(() => insertTps(ws, addTps));
	},
	close() {
		console.log(new Date().toISOString(), "client left");
	},
});

function insertTps(ws: ElysiaWS, addTps: AddTps) {
	// Iterate over all intervals in tpsMstpMap
	const insertPromises = Object.entries(addTps.tpsMstpMap).map(
		([intervalKey, tpsMsptArray]) => {
			const interval = parseInt(intervalKey, 10); // Convert string key to number
			const tpsValue = tpsMsptArray[0] ?? 0; // Get TPS (first element of array)
			const msptValue = tpsMsptArray[1] ?? 0;

			console.log(
				new Date(),
				`interval, msptArray, tps, mspt:`,
				interval,
				tpsMsptArray,
				tpsValue,
				msptValue,
			);
			const dbTps = {
				uuid: crypto.randomUUID(),
				timestamp: new Date(addTps.time),
				tps: tpsValue,
				world: addTps.worldUUID,
				interval, // Store the interval as integer
			};

			console.log(`Inserting TPS for interval ${interval}:`, dbTps);

			return db.insert(tpsTable).values(dbTps);
		},
	);

	Promise.all(insertPromises)
		.then(() => {
			console.log(
				new Date().toISOString(),
				"got addTpsProbe, inserted all intervals, sending:",
				addTps,
			);
			ws.send(addTps);
		})
		.catch((error) => {
			console.error("Error inserting TPS records:", error);
		});
}
