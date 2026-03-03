interface Props {
	label?: string
	onClick: () => void
}

export function AddToolCard({ label = "Add Tool", onClick }: Props) {
	return (
		<button
			onClick={onClick}
			className="bg-[var(--accent-bg)] border-[1.5px] border-dashed border-[var(--border)] rounded-md flex items-center justify-center min-h-[140px] min-w-[185px] text-[11px] font-semibold text-[var(--accent)] gap-1.5 hover:bg-[var(--accent-bg2)] hover:border-[var(--accent)] transition-all duration-150 w-full"
		>
			+ {label}
		</button>
	)
}
