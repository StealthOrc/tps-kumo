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
				`http://${env.PUBLIC_FRONTEND_URL || DEFAULT_FRONTEND_URL}`,
				`https://${env.PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL}`,
			],
		}),
	)
	// mount routes
	.use(ws)
	.listen(3001, () => {
		console.log(
			`🦊 Elysia server listening on http://${env.PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL}`,
		);
	});

export type App = typeof app;
