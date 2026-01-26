import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";

const uuidSchema = z.uuid();
type UUID = z.infer<typeof uuidSchema>;

const UUID_ZERO: UUID = "00000000-0000-0000-0000-000000000000";

export const tps = sqliteTable("tps", {
	uuid: text().primaryKey().notNull().unique(),
	timestamp: integer({ mode: "timestamp" }).notNull(),
	tps: real("tps").notNull(),
	world: text()
		.references(() => worlds.uuid)
		.notNull()
		.default(UUID_ZERO),
});

export const worlds = sqliteTable("worlds", {
	uuid: text().primaryKey().unique(),
	name: text().notNull(),
});
