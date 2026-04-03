const GUESSES_PER_SEC = 1e12

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
  return `${Math.ceil(seconds / 3.15e10)} centuries`
}

export function getCrackTimeColor(bits: number): "red" | "amber" | "green" {
  if (bits < 40) return "red"
  if (bits < 80) return "amber"
  return "green"
}
