interface Props {
	className?: string;
}

export function Footer({ className = '' }: Props) {
	return (
		<footer
			className={`border-t border-[var(--border2)] py-3 px-3.5 text-[9px] text-[var(--ink3)] bg-[var(--topbar-bg)] ${className}`}
		>
			<div className="text-center">
				<a
					href="https://toolshed.fyi"
					target="_blank"
					rel="noopener noreferrer"
					className="text-[var(--accent)] hover:underline"
				>
					ToolShed.fyi
				</a>
				<span className="mx-1">·</span>
				<span>created with 📐 by <a href="https://lunchbox.studio" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Lunchbox Studio</a></span>
			</div>
		</footer>
	);
}
