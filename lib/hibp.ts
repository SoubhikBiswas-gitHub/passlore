const HIBP_RANGE_BASE = "https://api.pwnedpasswords.com/range"

export interface CheckHibpOptions {
  /** Passed to `fetch`; abort to cancel without treating as a hard failure in the UI. */
  signal?: AbortSignal
}

/**
 * Pwned Passwords k-anonymity range API (SHA-1, first 5 hex chars).
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 *
 * Returns `count`: how many times that hash appears in HIBP’s merged breach corpus (not “number of distinct breaches”).
 */
export async function checkHibp(
  password: string,
  options?: CheckHibpOptions
): Promise<{ breached: boolean; count: number } | null> {
  if (password.length === 0) {
    return { breached: false, count: 0 }
  }

  try {
    const encoded = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-1", encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()

    if (hashHex.length !== 40) {
      return null
    }

    const prefix = hashHex.slice(0, 5)
    const suffix = hashHex.slice(5)

    const res = await fetch(`${HIBP_RANGE_BASE}/${prefix}`, {
      headers: { "Add-Padding": "true" },
      signal: options?.signal,
    })

    if (!res.ok) {
      return null
    }

    const text = await res.text()
    const lines = text.split(/\r?\n/)

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line) continue

      const colon = line.indexOf(":")
      if (colon <= 0) continue

      const lineSuffix = line.slice(0, colon).toUpperCase()
      const countPart = line.slice(colon + 1).trim()
      const count = parseInt(countPart, 10)

      if (!Number.isFinite(count) || count < 1) {
        continue
      }

      if (lineSuffix === suffix) {
        return { breached: true, count }
      }
    }

    return { breached: false, count: 0 }
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw e
    }
    return null
  }
}
