import clsx from "clsx"

const BRAND_ACTIVE_STYLES: Record<string, string> = {
  DeWalt:    "!bg-[#ffbe00] !border-[#ffbe00] !text-[#7a5200]",
  Milwaukee: "!bg-[#cc0000] !border-[#cc0000] !text-white",
  Ryobi:     "!bg-[#6ab023] !border-[#6ab023] !text-white",
  Makita:    "!bg-[#00aec7] !border-[#00aec7] !text-white",
  Bosch:     "!bg-[#006eaf] !border-[#006eaf] !text-white",
  Ridgid:    "!bg-[#f05500] !border-[#f05500] !text-white",
  Kobalt:    "!bg-[#0066cc] !border-[#0066cc] !text-white",
  Other:     "!bg-[#888] !border-[#888] !text-white",
}

interface Props {
  active?: boolean
  brand?: string
  onClick?: () => void
  children: React.ReactNode
}

export function Pill({ active, brand, onClick, children }: Props) {
  const brandStyle = active && brand ? BRAND_ACTIVE_STYLES[brand] : undefined

  return (
    <button
      onClick={onClick}
      className={clsx(
        "font-mono text-[9px] font-bold px-[10px] py-1 rounded-full border-[1.5px] uppercase tracking-[0.06em] transition-all duration-150 cursor-pointer",
        active && !brandStyle && "bg-[var(--accent)] text-white border-[var(--accent)]",
        !active && "border-[var(--border)] bg-[var(--white)] text-[var(--ink2)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        brandStyle,
      )}
      data-brand={brand}
    >
      {children}
    </button>
  )
}
