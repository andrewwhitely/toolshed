import { BRAND_COLORS } from "@/constants/brands"
import type { Tool } from "@/types"

interface Props {
    tool: Tool
    projectCount: number
    onViewProjects: (toolName: string) => void
    onClick?: () => void
}

export function ToolCard({ tool, projectCount, onViewProjects, onClick }: Props) {
    const colors = BRAND_COLORS[tool.brand]

    return (
        <div
            onClick={onClick}
            className="bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
            <div className="h-[5px]" style={{ background: colors.bar }} />
            <div className="p-3">
                <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--ink3)] mb-0.5">{tool.cat}</div>
                <div className="text-[13px] font-semibold text-[var(--ink)] mb-1.5">{tool.name}</div>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-[0.06em] mb-2 ${colors.tag} ${colors.text}`}>
                    {tool.brand}
                </span>
                {tool.model && (
                    <div className="text-[9px] text-[var(--ink3)] mb-1">{tool.model}</div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border2)] text-[10px] text-[var(--ink3)]">
                    <span className="truncate max-w-[90px]">{tool.notes || "—"}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewProjects(tool.name); }}
                        className="text-[9px] font-bold text-[var(--accent)] underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                        {projectCount} project{projectCount !== 1 ? "s" : ""}
                    </button>
                </div>
            </div>
        </div>
    )
}
