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
	const combined = clsx("flex flex-col", className);
	return (
		<div className={combined}>
			<h3>{world}</h3>
			{children}
		</div>
	);
}
