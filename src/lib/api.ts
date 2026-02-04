import { treaty } from "@elysiajs/eden";
import type { App } from "../server/elysia"; // the exported treaty client
import { DEFAULT_BACKEND_URL } from "./const";

export function createWebSocket(address: string = DEFAULT_BACKEND_URL) {
	return treaty<App>(address).ws; // <-- Eden‑Treaty WebSocket helper
}
type WsObj = ReturnType<typeof createWebSocket>;
type WsSubscribeFn = WsObj["subscribe"];
export type WsSub = ReturnType<WsSubscribeFn>;
