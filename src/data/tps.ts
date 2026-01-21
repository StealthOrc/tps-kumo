import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import * as schema from '@/db/schema'
import { desc } from 'drizzle-orm'

export const getTPS = createServerFn({
  method: 'GET',
}).handler(async () => {
  const tps: typeof schema.tps.$inferSelect[] = await db.select().from(schema.tps).orderBy(desc(schema.tps.timestamp))
  // with unique id
  return tps.map((t) => ({
    id: t.id,
    timestamp: t.timestamp,
    tps: t.tps,
  }))
})
