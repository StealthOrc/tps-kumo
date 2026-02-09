import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import * as tables from "@/db/schema";
import { DEFAULT_INTERVAL, DEFAULT_WORLD_NAME } from "@/lib/const";
import type { Internal } from "@/lib/types";

export async function selectTPSWithWorldName(): Promise<Internal.TPSPointMap> {
	const queryResult = await db
		.select({
			worldName: tables.worlds.name,
			worldUUID: tables.tps.world,
			time: tables.tps.timestamp,
			interval: tables.tps.interval,
			tps: tables.tps.tps,
		})
		.from(tables.tps)
		.leftJoin(tables.worlds, eq(tables.tps.world, tables.worlds.uuid))
		.orderBy(desc(tables.tps.world), desc(tables.tps.timestamp));

	const out: Internal.TPSPointMap = { tpsData: {} };
	for (const row of queryResult) {
		const worldUUID = row.worldUUID;
		if (!out.tpsData[worldUUID])
			out.tpsData[worldUUID] = {
				worldName: row.worldName ?? DEFAULT_WORLD_NAME,
				intervalData: {},
			};
		const interval = row.interval ?? DEFAULT_INTERVAL;
		if (!out.tpsData[worldUUID].intervalData[interval])
			out.tpsData[worldUUID].intervalData[interval] = [];
		out.tpsData[worldUUID].intervalData[interval].push({
			time: row.time.toISOString(),
			tps: row.tps,
			mspt: 0,
		} as Internal.TPSPoint);
	}
	return out;
}
