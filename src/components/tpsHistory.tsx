export default function TpsHistory({
	interval,
	children,
}: {
	interval: number;
	children: React.ReactNode;
}) {
	return (
		<div className="border-4 border-[hsl(224,15%,20%)] bg-[hsl(212,30%,18%)] rounded-a px-4 py-2">
			<div className="flex gap-1 items-center pb-1">
				<p>{interval}s</p>
				<hr className="flex-1 border-t border-gray-300 dark:border-gray-700 rounded-2xl m-0 ml-2" />
			</div>
			<div className="flex gap-0.5">{children}</div>
		</div>
	);
}
