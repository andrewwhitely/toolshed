import { useEffect } from "react"
import type { ThemeId } from "@/types"
import { BRAND_THEMES } from "@/constants/brands"

export function useTheme(themeId: ThemeId) {
  useEffect(() => {
    document.body.setAttribute("data-theme", themeId === "default" ? "" : themeId)
  }, [themeId])

  return BRAND_THEMES.find(t => t.id === themeId) ?? BRAND_THEMES[0]
}
