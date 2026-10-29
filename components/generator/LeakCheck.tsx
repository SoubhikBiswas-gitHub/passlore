'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { CheckCircle, CircleNotch, MagnifyingGlass, Question, WifiSlash, XCircle } from '@phosphor-icons/react'

import { Lore } from '@/components/Lore'
import { checkLeak, sha1Hex } from '@/lib/generator'
import { cn } from '@/lib/utils'
import s from './Generator.module.css'

type LeakState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'found'; count: number }
  | { status: 'not-found' }
  | { status: 'failed'; reason: 'offline' | 'error' }

const btn =
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-[18px] text-[15px] font-semibold transition-[background-color,border-color,transform] duration-[80ms] ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55'
const btnPrimary = cn(btn, 'border-transparent bg-primary text-on-primary hover:bg-primary-hover')
const btnSecondary = cn(btn, 'border-line-strong bg-surface text-ink hover:bg-surface-2 [[data-theme=hc]_&]:border-2')

function useOnline() {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])
  return online
}

export function LeakCheck({
  password,
  subject,
  open,
  onOpenChange,
  onRegenerate,
}: {
  password: string
  subject?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegenerate?: () => void
}) {
  const bodyId = useId()
  const online = useOnline()
  const [hash, setHash] = useState('')
  const [state, setState] = useState<LeakState>({ status: 'idle' })
  const [announce, setAnnounce] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (!open || hash || !password) return
    let live = true
    sha1Hex(password)
      .then((h) => live && setHash(h.toUpperCase()))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [open, hash, password])

  const runCheck = async () => {
    if (!password) return
    onOpenChange(true)
    if (!navigator.onLine) {
      setState({ status: 'failed', reason: 'offline' })
      setAnnounce('Couldn’t check: offline. Unknown.')
      return
    }
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setState({ status: 'checking' })
    setAnnounce('Checking leak data.')
    const result = await checkLeak(password, ctrl.signal)
    if (ctrl.signal.aborted) return
    if (result.status === 'found') {
      setState({ status: 'found', count: result.count })
      setAnnounce('Found in leak data. Don’t use this one.')
    } else if (result.status === 'not-found') {
      setState({ status: 'not-found' })
      setAnnounce('Not in the leak data. A good sign, not proof of safety.')
    } else {
      setState({ status: 'failed', reason: result.reason })
      setAnnounce('Couldn’t check. Unknown, not safe.')
    }
  }

  const head = hash ? hash.slice(0, 5) : '•••••'
  const tail = hash ? hash.slice(5) : '•'.repeat(35)
  const checkDisabled = !online || !password

  return (
    <section
      id="leak"
      aria-labelledby={`${bodyId}-t`}
      className={cn(s.card, 'flex scroll-mt-3 flex-col gap-3 px-5 py-[18px]')}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id={`${bodyId}-t`} className="m-0 flex items-center gap-2 text-[17px] font-bold">
          <MagnifyingGlass size={20} aria-hidden="true" />
          Leak check <span className="text-[13px] font-medium text-ink-3">· optional</span>
        </h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => onOpenChange(!open)}
          className={cn(s.btn, s.btnG, s.btnSm)}
          style={{ color: 'var(--link)' }}
        >
          {open ? 'Hide' : 'Open'}
        </button>
      </div>

      {!open && (
        <p className="m-0 text-sm text-ink-2">
          See if this password appears in known breaches. Only 5 of 40 hash characters leave your device, and only
          when you press Check.
        </p>
      )}

      {open && (
        <div id={bodyId} className="flex flex-col gap-3">
          <p className="m-0 text-sm text-ink-2">
            {subject && online ? subject + ' ' : ''}
            {online
              ? 'Your browser hashes the password. Only the highlighted start of the hash is sent to Have I Been Pwned; the match happens here.'
              : 'You’re offline. The check needs a connection; everything else works.'}
          </p>
          <p className="sr-only">
            {hash ? `SHA-1 hash starts with ${head.split('').join(' ')}. Only these 5 characters are sent.` : ''}
          </p>
          <div
            aria-hidden="true"
            className="rounded-sm bg-surface-2 px-3 py-2.5 font-mono text-[13px] leading-normal [overflow-wrap:anywhere]"
          >
            <span className="rounded-[3px] bg-primary-soft px-0.5 font-bold text-on-primary-soft">{head}</span>
            <span className="text-ink-3">{tail}</span>
          </div>
          <p className="m-0 flex justify-between gap-2 text-[13px] text-ink-3">
            <span>
              <strong className="text-on-primary-soft">5 characters</strong> leave this device
            </span>
            <span>35 characters stay here</span>
          </p>

          {state.status === 'idle' && (
            <button type="button" onClick={runCheck} disabled={checkDisabled} className={cn(btnSecondary, 'self-start')}>
              {online ? (
                <MagnifyingGlass size={20} aria-hidden="true" />
              ) : (
                <WifiSlash size={20} aria-hidden="true" />
              )}
              {online ? 'Check for leaks' : 'Needs a connection'}
            </button>
          )}

          {state.status === 'checking' && (
            <div className="flex min-h-11 items-center gap-3">
              <CircleNotch size={24} aria-hidden="true" className="animate-spin text-link motion-reduce:animate-none" />
              <span className="font-semibold">Checking… only {head} was sent</span>
            </div>
          )}

          {(state.status === 'found' || state.status === 'not-found' || state.status === 'failed') && (
            <LeakResult state={state} />
          )}

          {state.status === 'found' && onRegenerate && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onRegenerate} className={btnPrimary}>
                Cut a new one
              </button>
            </div>
          )}

          {state.status === 'failed' && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={runCheck} disabled={!online} className={btnSecondary}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </section>
  )
}

function LeakResult({
  state,
}: {
  state: { status: 'found'; count: number } | { status: 'not-found' } | { status: 'failed'; reason: 'offline' | 'error' }
}) {
  const view =
    state.status === 'found'
      ? {
          tone: 'border-danger bg-danger-soft',
          ink: 'text-danger',
          Icon: XCircle,
          title: 'Found in leak data — don’t use this one',
          text: `This exact password appears ${
            state.count === 1 ? 'once' : `${state.count.toLocaleString('en-US')} times`
          } in Have I Been Pwned’s data. Attackers try known passwords first.`,
          mood: 'worried' as const,
          scene: 'puddle' as const,
        }
      : state.status === 'not-found'
        ? {
            tone: 'border-success bg-success-soft',
            ink: 'text-success',
            Icon: CheckCircle,
            title: 'Not in the leak data',
            text: 'A good sign, not proof of safety: it could still leak tomorrow, and reuse would undo it.',
            mood: 'happy' as const,
            scene: 'shield' as const,
          }
        : {
            tone: 'border-warning bg-warning-soft',
            ink: 'text-warning',
            Icon: Question,
            title: 'Couldn’t check — unknown',
            text:
              state.reason === 'offline'
                ? 'You’re offline. Unknown doesn’t mean safe.'
                : 'The service didn’t answer. Unknown doesn’t mean safe — try again in a moment.',
            mood: 'unsure' as const,
            scene: 'cloud' as const,
          }
  const { Icon } = view
  return (
    <div className={cn('flex items-start gap-2.5 rounded-md border p-3', view.tone)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className={cn('m-0 flex items-start gap-2 font-bold', view.ink)}>
          <Icon size={24} weight="bold" aria-hidden="true" className="shrink-0" />
          <span>{view.title}</span>
        </p>
        <p className="m-0 text-sm text-ink">{view.text}</p>
      </div>
      <Lore mood={view.mood} scene={view.scene} size={92} />
    </div>
  )
}
