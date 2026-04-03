export async function checkHibp(
  password: string
): Promise<{ breached: boolean; count: number } | null> {
  try {
    const encoded = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-1", encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()

    const prefix = hashHex.slice(0, 5)
    const suffix = hashHex.slice(5)

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    })

    if (!res.ok) return null

    const text = await res.text()
    const lines = text.split("\r\n")
    const match = lines.find((l) => l.startsWith(suffix))

    if (!match) return { breached: false, count: 0 }

    const count = parseInt(match.split(":")[1], 10)
    return { breached: count > 0, count }
  } catch {
    return null
  }
}
