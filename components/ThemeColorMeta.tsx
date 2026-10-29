"use client"

import { useEffect } from "react"

function syncThemeColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
  if (!value) return
  let meta = document.querySelector('meta[name="theme-color"][data-dynamic="true"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.setAttribute("name", "theme-color")
    meta.setAttribute("data-dynamic", "true")
    document.head.appendChild(meta)
  }
  meta.setAttribute("content", value)
}

export function ThemeColorMeta() {
  useEffect(() => {
    syncThemeColor()
    // next-themes sets data-theme after child effects run, so watch the attribute itself.
    const observer = new MutationObserver(syncThemeColor)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  return null
}
