const RANGE = 4294967296

export function rnd(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > RANGE) throw new RangeError("rnd needs a positive integer up to 2^32")
  const lim = Math.floor(RANGE / n) * n
  const buf = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    if (buf[0] < lim) return buf[0] % n
  }
}

export function pickN(pool: string, n: number): string {
  let o = ""
  for (let i = 0; i < n; i++) o += pool[rnd(pool.length)]
  return o
}
