import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import { Chat } from "@/components/chat";

export const Route = createFileRoute("/testws")({
	component: TestWS,
});

function TestWS() {
	return (
		<>
			<Link {...linkOptions({ to: "/" })}>Home</Link>
			<Chat />
		</>
	);
}
