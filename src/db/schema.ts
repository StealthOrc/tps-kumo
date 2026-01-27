import {
	doublePrecision,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import z from "zod";

const uuidSchema = z.uuid();
type UUID = z.infer<typeof uuidSchema>;

const UUID_ZERO: UUID = "00000000-0000-0000-0000-000000000000";

export const tps = pgTable("tps", {
	uuid: uuid().primaryKey().notNull().unique(),
	timestamp: timestamp().notNull(),
	tps: doublePrecision("tps").notNull(),
	world: uuid()
		.references(() => worlds.uuid)
		.notNull()
		.default(UUID_ZERO),
});

export const worlds = pgTable("worlds", {
	uuid: uuid().primaryKey().unique(),
	name: varchar().notNull(),
});
