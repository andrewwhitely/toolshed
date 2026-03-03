interface Props {
  value: number | string
  label: string
}

export function StatCard({ value, label }: Props) {
  return (
    <div className="bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md p-4 transition-colors duration-300">
      <div className="font-serif text-[28px] sm:text-[36px] font-black text-[var(--accent)] leading-none transition-colors duration-300">
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-[0.12em] text-[var(--ink3)] mt-1">{label}</div>
    </div>
  )
}
