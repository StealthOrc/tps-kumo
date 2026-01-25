import { createRouter } from "@tanstack/react-router";
import { _404 } from "./components/404";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const router = createRouter({
		defaultNotFoundComponent: _404,
		routeTree,
		context: {},
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	});

	return router;
};
