import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { env } from "@/env";
import { DEFAULT_BACKEND_URL, DEFAULT_FRONTEND_URL } from "@/lib/const";
// Example route – you can add more under src/routes/api/*.ts
import { ws } from "./ws";

const app = new Elysia()
	// allow the React dev server to call the API
	.use(
		cors({
			origin: [
				`${env.VITE_FRONTEND_URL || `https://${DEFAULT_FRONTEND_URL}`}`,
				`${env.VITE_BACKEND_URL || `https://${DEFAULT_BACKEND_URL}`}`,
			],
		}),
	)
	.get("/", "YOU SHOULD NOT BE PEEKING AROUND HERE! grr òwó")
	// mount routes
	.use(ws)
	.listen(3001, () => {
		console.log(
			`🦊 Elysia server listening on ${env.VITE_BACKEND_URL || `https://${DEFAULT_BACKEND_URL}`}`,
		);
	});

export type App = typeof app;
