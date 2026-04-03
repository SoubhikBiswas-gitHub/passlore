/** Uniform index in [0, max) using crypto.getRandomValues without modulo bias. */
export function randomIndex(max: number): number {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("max must be a positive integer")
  }
  if (max === 1) return 0

  const maxValid = Math.floor(0x1_0000_0000 / max) * max - 1
  const buf = new Uint32Array(1)
  let x: number
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x > maxValid)

  return x % max
}
