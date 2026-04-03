"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/**
 * Syncs `<meta name="theme-color">` with `--background` so browser chrome matches
 * light / dark / sepia / high-contrast (static viewport.themeColor cannot).
 */
export function ThemeColorMeta() {
  const { resolvedTheme, theme } = useTheme()

  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
    if (!raw) return
    const content = raw.startsWith("#") ? raw : `hsl(${raw})`

    let el = document.querySelector('meta[name="theme-color"][data-dynamic="true"]')
    if (!el) {
      el = document.createElement("meta")
      el.setAttribute("name", "theme-color")
      el.setAttribute("data-dynamic", "true")
      document.head.appendChild(el)
    }
    el.setAttribute("content", content)
  }, [resolvedTheme, theme])

  return null
}
