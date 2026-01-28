import { treaty } from "@elysiajs/eden";
import { env } from "@/env";
import type { App } from "../server/elysia"; // the exported treaty client
import { DEFAULT_BACKEND_URL } from "./const";

export function createWebSocket() {
	return treaty<App>(env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL).ws; // <-- Eden‑Treaty WebSocket helper
}
type WsObj = ReturnType<typeof createWebSocket>;
type WsSubscribeFn = WsObj["subscribe"];
export type WsSub = ReturnType<WsSubscribeFn>;
