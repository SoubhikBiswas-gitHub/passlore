'use client'

import { useEffect, useMemo, useState } from 'react'
import { SpeakerHigh, Stop } from '@phosphor-icons/react'

const nato: Record<string, string> = {
  a: 'alfa', b: 'bravo', c: 'charlie', d: 'delta', e: 'echo', f: 'foxtrot', g: 'golf', h: 'hotel', i: 'india',
  j: 'juliett', k: 'kilo', l: 'lima', m: 'mike', n: 'november', o: 'oscar', p: 'papa', q: 'quebec', r: 'romeo',
  s: 'sierra', t: 'tango', u: 'uniform', v: 'victor', w: 'whiskey', x: 'x-ray', y: 'yankee', z: 'zulu',
}
const digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const symbols: Record<string, string> = {
  '!': 'exclamation', '@': 'at', '#': 'hash', $: 'dollar', '%': 'percent', '^': 'caret', '&': 'ampersand',
  '*': 'asterisk', '(': 'open paren', ')': 'close paren', '-': 'hyphen', _: 'underscore', '=': 'equals', '+': 'plus',
  '[': 'open bracket', ']': 'close bracket', '{': 'open brace', '}': 'close brace', ';': 'semicolon', ':': 'colon',
  ',': 'comma', '.': 'dot', '<': 'less than', '>': 'greater than', '/': 'slash', '?': 'question', '~': 'tilde',
  ' ': 'space', '\\': 'backslash', '|': 'bar', '"': 'double quote', "'": 'single quote', '`': 'backtick',
}

type Kind = 'upper' | 'lower' | 'digit' | 'symbol'

function kindOf(ch: string): Kind {
  if (/[0-9]/.test(ch)) return 'digit'
  if (/[A-Z]/.test(ch)) return 'upper'
  if (/[a-z]/.test(ch)) return 'lower'
  return 'symbol'
}

function describe(ch: string) {
  const kind = kindOf(ch)
  if (kind === 'upper') return { kind, word: `CAP ${nato[ch.toLowerCase()]}`, say: `capital ${nato[ch.toLowerCase()]}` }
  if (kind === 'lower') return { kind, word: nato[ch], say: nato[ch] }
  if (kind === 'digit') return { kind, word: digits[Number(ch)], say: digits[Number(ch)] }
  const name = symbols[ch] ?? 'symbol'
  return { kind, word: name, say: symbols[ch] ?? ch }
}

const tone: Record<Kind, string> = { upper: 'text-ink', lower: 'text-ink', digit: 'text-digit', symbol: 'text-sym' }

export function SpellItOut({ password }: { password: string }) {
  const [canSpeak, setCanSpeak] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [status, setStatus] = useState('')

  const tiles = useMemo(() => Array.from(password).map((ch) => ({ ch, ...describe(ch) })), [password])

  useEffect(() => {
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [password])

  const speak = () => {
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      setStatus('Stopped reading.')
      return
    }
    const isWords = /^[A-Za-z0-9]+(?:[ \-._][A-Za-z0-9]+)+$/.test(password) && /[A-Za-z]{3,}/.test(password)
    const text = isWords
      ? password.split(/([ \-._])/).map((p) => (p.length === 1 && /[ \-._]/.test(p) ? symbols[p] : p)).join(', ')
      : tiles.map((t) => t.say).join(', ')
    // online voices synthesise on a server, which would send the password off the device
    const local = synth.getVoices().filter((v) => v.localService)
    const voice = local.find((v) => v.lang.startsWith('en')) ?? local[0]
    if (!voice) {
      setStatus('Reading aloud needs an on-device voice, and this browser only offers online ones.')
      return
    }
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice
    u.rate = 0.85
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.speak(u)
    setSpeaking(true)
    setStatus('Reading aloud — make sure nobody nearby is listening.')
  }

  return (
    <div className="flex flex-col gap-2">
      <ol
        aria-label="Spelled out, character by character"
        className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1.5 p-0"
      >
        {tiles.map((t, i) => (
          <li
            key={i}
            aria-label={`${i + 1}: ${t.say}`}
            className="flex flex-col items-center rounded-sm border border-line bg-surface-2 px-1 py-2"
          >
            <span aria-hidden="true" className={`font-mono text-2xl leading-[1.2] ${tone[t.kind]}`}>
              {t.ch === ' ' ? '␣' : t.ch}
            </span>
            <span aria-hidden="true" className="text-center text-xs font-semibold text-ink-2">
              {t.word}
            </span>
          </li>
        ))}
      </ol>
      {canSpeak && (
        <button
          type="button"
          onClick={speak}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm px-3 text-sm font-semibold text-link hover:bg-surface-2"
        >
          {speaking ? <Stop size={20} aria-hidden="true" /> : <SpeakerHigh size={20} aria-hidden="true" />}
          {speaking ? 'Stop reading' : 'Read it aloud'}
        </button>
      )}
      <p role="status" aria-live="polite" className={status ? 'm-0 text-[13px] text-ink-3' : 'sr-only'}>
        {status}
      </p>
    </div>
  )
}
