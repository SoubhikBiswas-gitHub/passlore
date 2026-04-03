import { WORDS } from "./words"
import { randomIndex } from "./unbiased-random"

export function generatePassphrase(wordCount: number, separator: string): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[randomIndex(WORDS.length)])
  }
  return words.join(separator)
}

export function getPassphraseEntropy(wordCount: number): number {
  const n = WORDS.length
  if (n < 2) return 0
  return Math.floor(wordCount * Math.log2(n))
}
