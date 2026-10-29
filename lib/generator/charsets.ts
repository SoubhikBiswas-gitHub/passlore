export const SETS = {
  U: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  L: "abcdefghijklmnopqrstuvwxyz",
  D: "0123456789",
  S: "!@#$%^&*()-_=+[]{};:,.<>/?~",
  SIM: "0Oo1lI|",
  AMB: "{}[]()/\\'\"`~,;:.<>",
} as const

export function uniq(str: string): string {
  return Array.from(new Set(str.split(""))).join("")
}
