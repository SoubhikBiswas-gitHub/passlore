export type LeakResult =
  | { status: "found"; count: number; prefix: string }
  | { status: "not-found"; prefix: string }
  | { status: "failed"; reason: "offline" | "error"; prefix: string }

export const PWNED_RANGE_URL = "https://api.pwnedpasswords.com/range/"

export async function sha1Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
}

function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false
}

export function countInRange(body: string, suffix: string): number | null {
  const want = suffix.toUpperCase()
  let rows = 0
  for (const line of body.split(/\r?\n/)) {
    const m = /^([0-9A-Fa-f]{35}):(\d+)$/.exec(line.trim())
    if (!m) continue
    rows++
    // Padding rows carry a count of 0 and are not real matches.
    if (m[1].toUpperCase() === want && +m[2] > 0) return +m[2]
  }
  // a body with no range rows is a portal or error page, not an answer
  return rows ? 0 : null
}

export async function checkLeak(password: string, signal?: AbortSignal): Promise<LeakResult> {
  let hash = ""
  try {
    hash = await sha1Hex(password)
  } catch {
    return { status: "failed", reason: "error", prefix: "" }
  }
  const prefix = hash.slice(0, 5)
  if (isOffline()) return { status: "failed", reason: "offline", prefix }
  try {
    const res = await fetch(PWNED_RANGE_URL + prefix, { headers: { "Add-Padding": "true" }, signal, cache: "no-store" })
    if (!res.ok) return { status: "failed", reason: "error", prefix }
    const count = countInRange(await res.text(), hash.slice(5))
    if (count === null) return { status: "failed", reason: "error", prefix }
    return count > 0 ? { status: "found", count, prefix } : { status: "not-found", prefix }
  } catch {
    return { status: "failed", reason: isOffline() ? "offline" : "error", prefix }
  }
}
