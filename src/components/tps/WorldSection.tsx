import clsx from "clsx";
import type React from "react";

type WorldSectionProps = {
	world: string;
	children: React.ReactNode;
};

export default function WorldSection({
	world,
	className,
	children,
}: WorldSectionProps & React.ComponentProps<"div">) {
	const combined = clsx(
		"hytale-card flex flex-col gap-3 px-5 py-4",
		className,
	);
	return (
		<div className={combined}>
			<h3 className="text-lg font-semibold m-0" style={{ color: "var(--hytale-text)" }}>{world}</h3>
			{children}
		</div>
	);
}
