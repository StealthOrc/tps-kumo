export default function TpsHistory({
	interval,
	children,
}: {
	interval: number;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="flex gap-2 items-center pb-2">
				<span className="text-sm font-medium" style={{ color: "var(--hytale-text-muted)" }}>{interval}s</span>
				<hr className="flex-1 m-0 border-0 h-px" style={{ backgroundColor: "var(--hytale-border)" }} />
			</div>
			<div className="flex gap-0.5 flex-wrap">{children}</div>
		</div>
	);
}
