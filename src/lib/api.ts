// src/lib/api.ts
import { treaty } from "@elysiajs/eden";
import type { App } from "../server/elysia"; // the exported treaty client

export const chatWs = treaty<App>("localhost:3001").ws; // <-- Eden‑Treaty WebSocket helper
export type WsSub = ReturnType<typeof chatWs.subscribe>;
