export function calcEntropy(charsetSize: number, length: number): number {
  if (charsetSize <= 1) return 0
  return Math.floor(length * Math.log2(charsetSize))
}
