import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

export type getTPSType = ReturnType<typeof getTPS>;

export const getTPS = createServerFn({
	method: "GET",
}).handler(async () => {
	const tps: (typeof schema.tps.$inferSelect)[] = await db
		.select()
		.from(schema.tps)
		.orderBy(desc(schema.tps.timestamp));
	// with unique id
	return tps.map((t) => ({
		id: t.uuid,
		tps: t.tps,
		timestamp: t.timestamp.toISOString(),
		interval: t.interval,
	}));
});
