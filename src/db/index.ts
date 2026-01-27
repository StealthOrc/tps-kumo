import { drizzle } from "drizzle-orm/node-postgres";

let url = process.env.DATABASE_URL;
if (!url) url = "";
let authToken = process.env.AUTH_TOKEN;
if (!authToken) authToken = "";
export const db = drizzle(url);
