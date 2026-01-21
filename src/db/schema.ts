import { doublePrecision, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'

export const tps = pgTable('tps', {
  id: serial().primaryKey().unique(),
  timestamp: timestamp('timestamp').notNull(),
  tps: doublePrecision('tps').notNull(),
})
