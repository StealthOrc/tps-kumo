import clsx from "clsx";
import type React from "react";
import TpsHistory from "../tpsHistory";

type WorldSectionProps = {
	world: string;
	children: React.ReactNode;
};

export default function WorldSection({
	world,
	className,
	children,
	...rest
}: WorldSectionProps & React.ComponentProps<"div">) {
	const combined = clsx(
		"flex flex-col gap-1 border-4 border-[hsl(224,15%,20%)] bg-[hsl(212,30%,18%)] rounded-a px-4 py-2",
		className,
	);
	return (
		<div className={combined}>
			<h3>{world}</h3>
			{children}
		</div>
	);
}
