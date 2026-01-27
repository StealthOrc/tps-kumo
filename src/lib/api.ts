// src/lib/api.ts
import { treaty } from "@elysiajs/eden";
import { env } from "@/env";
import type { App } from "../server/elysia"; // the exported treaty client
import { DEFAULT_BACKEND_URL } from "./const";

export const chatWs = treaty<App>(
	env.PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL,
).ws; // <-- Eden‑Treaty WebSocket helper
export type WsSub = ReturnType<typeof chatWs.subscribe>;
