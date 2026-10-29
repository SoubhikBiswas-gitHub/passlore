import type { RecipeId } from "./types"

export type HistoryEntry = { id: number; value: string; recipe: RecipeId; at: number; bits: number }

export const HISTORY_KEY = "passlore:drawer"
export const HISTORY_LIMIT = 20

function isEntry(e: unknown): e is HistoryEntry {
  if (!e || typeof e !== "object") return false
  const o = e as Record<string, unknown>
  return typeof o.id === "number" && typeof o.value === "string" && typeof o.recipe === "string" && typeof o.at === "number" && typeof o.bits === "number"
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, HISTORY_LIMIT) : []
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)))
  } catch {}
}
