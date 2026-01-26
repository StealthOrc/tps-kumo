import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema.ts";

let url = process.env.DATABASE_URL;
if (!url) url = "";
export const db = drizzle(url, { schema });
