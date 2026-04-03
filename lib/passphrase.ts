import { WORDS } from "./words"

function cryptoRandom(max: number): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % max
}

export function generatePassphrase(wordCount: number, separator: string): string {
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[cryptoRandom(WORDS.length)])
  }
  return words.join(separator)
}

export function getPassphraseEntropy(wordCount: number): number {
  return Math.floor(wordCount * Math.log2(7776))
}
