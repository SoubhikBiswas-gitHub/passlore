const GUESSES_PER_SEC = 1e12
/** Divisor used when reducing seconds to centuries (unchanged from original behavior). */
const SEC_PER_CENTURY = 3.15e10

/** Huge bit counts make `Math.pow(2, bits)` imprecise; string output becomes scientific notation. */
function formatHugeCrackTime(bits: number): string {
  const log10Combinations = bits * (Math.LN2 / Math.LN10)
  const log10Sec = log10Combinations - Math.log10(GUESSES_PER_SEC)
  const log10Centuries = log10Sec - Math.log10(SEC_PER_CENTURY)
  const exponent = Math.floor(log10Centuries)
  if (exponent < 1) return "Centuries+"
  return `~10^${exponent} centuries`
}

export function estimateCrackTime(bits: number): string {
  if (bits <= 0) return "Instantly"

  const combinations = Math.pow(2, bits)
  const seconds = combinations / GUESSES_PER_SEC

  if (seconds < 1) return "Instantly"
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`
  if (seconds < 2592000) return `${Math.ceil(seconds / 86400)} days`
  if (seconds < 31536000) return `${Math.ceil(seconds / 2592000)} months`
  if (seconds < 3.15e9) return `${Math.ceil(seconds / 31536000)} years`

  const centuries = seconds / SEC_PER_CENTURY
  const centuriesRounded = Math.ceil(centuries)
  const centuriesStr = String(centuriesRounded)
  if (
    !Number.isFinite(centuries) ||
    centuriesRounded > 1e15 ||
    centuriesStr.includes("e") ||
    centuriesStr.includes("E")
  ) {
    return formatHugeCrackTime(bits)
  }
  return `${centuriesRounded} centuries`
}

export function getCrackTimeColor(bits: number): "red" | "amber" | "green" {
  if (bits < 40) return "red"
  if (bits < 80) return "amber"
  return "green"
}
