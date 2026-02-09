import { Elysia } from "elysia";
import { db } from "@/db";
import { tps as tpsTable, worlds } from "@/db/schema";
import type { Internal } from "@/lib/types";
import { External, messageSchema } from "@/lib/types";

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
		const addTpsProbe = External.addTpsSchema.safeParse(message);
		if (!addTpsProbe.success) return;

		const addTps = addTpsProbe.data;

		const insertPromises: Promise<unknown>[] = [];

		for (const val of addTps.tpsData) {
			insertPromises.push(
				db
					.insert(worlds)
					.values({
						uuid: val.worldUUID,
						name: val.worldName,
					})
					.onConflictDoUpdate({
						target: worlds.uuid,
						set: { name: val.worldName },
					}),
			);
			for (const [intervalKey, tpsMsptArray] of Object.entries(
				val.tpsMstpMap,
			)) {
				const interval = parseInt(intervalKey, 10);
				const tpsValue = tpsMsptArray[0] ?? 0;
				insertPromises.push(
					db.insert(tpsTable).values({
						uuid: crypto.randomUUID(),
						timestamp: new Date(val.time),
						tps: tpsValue,
						world: val.worldUUID,
						interval,
					}),
				);
			}
		}

		Promise.all(insertPromises)
			.then(() => {
				const tpsPointMap = buildTpsPointMap(addTps);
				console.log(
					new Date().toISOString(),
					"inserted all TPS, sending TPS point map:",
					tpsPointMap,
				);
				ws.send(tpsPointMap);
			})
			.catch((error) => {
				console.error("Error inserting TPS records:", error);
			});
	},
	close() {
		console.log(new Date().toISOString(), "client left");
	},
});

function buildTpsPointMap(addTps: External.AddHytaleTps): Internal.TPSPointMap {
	const map: Internal.TPSPointMap = { tpsData: {} };

	for (const val of addTps.tpsData) {
		const timeStr = new Date(val.time).toISOString();

		if (!map.tpsData[val.worldUUID]) {
			map.tpsData[val.worldUUID] = {
				worldName: val.worldName,
				intervalData: {},
			};
		}

		for (const [intervalKey, tpsMsptArray] of Object.entries(val.tpsMstpMap)) {
			const tps = tpsMsptArray[0] ?? 0;
			const mspt = tpsMsptArray[1] ?? 0;
			const point: Internal.TPSPoint = { time: timeStr, tps, mspt };
			const arr = map.tpsData[val.worldUUID].intervalData[intervalKey];
			if (arr) arr.push(point);
			else map.tpsData[val.worldUUID].intervalData[intervalKey] = [point];
		}
	}

	return map;
}
