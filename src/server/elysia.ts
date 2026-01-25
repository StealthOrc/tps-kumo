// src/server/elysia.ts

import { cors } from "@elysiajs/cors";
import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";

// Example route – you can add more under src/routes/api/*.ts
import { ws } from "./ws";

const app = new Elysia()
	// allow the React dev server to call the API
	.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }))
	// mount routes
	.use(ws)
	.listen(3001, () => {
		console.log("🦊 Elysia server listening on http://localhost:3001");
	});

export type App = typeof app;
