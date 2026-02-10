export default function TpsHistory({
	interval,
	children,
}: {
	interval: number;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="flex gap-1 items-center pb-1">
				<p>{interval}s</p>
				<hr className="flex-1 border-t border-gray-300 dark:border-gray-700 rounded-2xl m-0 ml-2" />
			</div>
			<div className="flex gap-0.5">{children}</div>
		</div>
	);
}
