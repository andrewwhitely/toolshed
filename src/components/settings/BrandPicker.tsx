import { BRAND_THEMES } from "@/constants/brands"
import type { ThemeId } from "@/types"

interface Props {
  current: ThemeId
  onChange: (id: ThemeId) => void
}

export function BrandPicker({ current, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {BRAND_THEMES.map(brand => (
        <button
          key={brand.id}
          onClick={() => onChange(brand.id)}
          className={`flex flex-col items-center gap-2 p-3.5 border-2 rounded-lg transition-all duration-150 bg-[var(--bg)] hover:-translate-y-0.5 hover:shadow-md ${
            current === brand.id
              ? "border-[var(--accent)] shadow-[0_0_0_3px_var(--accent-bg2)]"
              : "border-[var(--border)] hover:border-[var(--accent)]"
          }`}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-md"
            style={{
              background: brand.color,
              color: brand.darkText ? "#1a1500" : "#fff",
            }}
          >
            {current === brand.id ? "✓" : ""}
          </div>
          <div className={`text-[10px] font-bold text-center ${current === brand.id ? "text-[var(--accent)]" : "text-[var(--ink2)]"}`}>
            {brand.name}
          </div>
          <div className="text-[8px] text-[var(--ink3)] text-center">{brand.tagline}</div>
        </button>
      ))}
    </div>
  )
}
