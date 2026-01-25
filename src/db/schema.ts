import {
	doublePrecision,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const tps = pgTable("tps", {
	id: serial().primaryKey().unique(),
	uuid: varchar().notNull(),
	timestamp: timestamp("timestamp").notNull(),
	tps: doublePrecision("tps").notNull(),
});
