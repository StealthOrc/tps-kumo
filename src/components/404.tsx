export function _404() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ backgroundColor: "var(--hytale-bg)", color: "var(--hytale-text)" }}>
			<div className="hytale-card max-w-md w-full p-8 text-center">
				<h1 className="text-2xl font-bold mb-2">Page not found</h1>
				<p className="mb-4" style={{ color: "var(--hytale-text-muted)" }}>
					Could not find what you were looking for.
				</p>
				<a href="/" className="hytale-btn inline-block px-4 py-2 no-underline">
					Back to Home
				</a>
			</div>
		</div>
	);
}
