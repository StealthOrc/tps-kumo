import { pgTable, serial, timestamp, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const tps = pgTable("tps", {
	id: serial().primaryKey().notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	tps: doublePrecision().notNull(),
});
