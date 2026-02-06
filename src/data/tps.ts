import { createServerFn } from "@tanstack/react-start";
import { selectTPSWithWorldName } from "@/db/queries";

export type getTPSType = ReturnType<typeof getTPS>;

export const getTPS = createServerFn({
	method: "GET",
}).handler(async () => {
	return await selectTPSWithWorldName();
});
