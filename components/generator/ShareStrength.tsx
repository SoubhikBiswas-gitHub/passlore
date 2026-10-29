'use client'

import { useMemo, useState } from 'react'
import { Copy, DownloadSimple, Export } from '@phosphor-icons/react'

import { Lore } from '@/components/Lore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LOGO_MARK, cardLook, cardPng, crack, shareSub, shareText, shareTime, shareWhat, tier } from '@/lib/generator'
import { cn } from '@/lib/utils'
import s from './Generator.module.css'

const btn =
  'inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-6 text-[17px] font-semibold transition-[background-color,border-color,transform] duration-[80ms] ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55'
const btnPrimary = cn(btn, 'border-transparent bg-primary text-on-primary hover:bg-primary-hover')
const btnSecondary = cn(btn, 'border-line-strong bg-surface text-ink hover:bg-surface-2')

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export function ShareStrength({
  bits,
  isWords,
  isPin = false,
  recipeName,
}: {
  bits: number
  isWords: boolean
  isPin?: boolean
  recipeName: string
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const card = useMemo(() => {
    const t = tier(bits)
    const args = { time: shareTime(crack(bits).text), tier: t, bits, isWords, isPin, recipe: recipeName }
    return { args, tierName: t.name, look: cardLook(t), sub: shareSub(args), text: shareText(args), time: args.time }
  }, [bits, isWords, isPin, recipeName])

  const what = shareWhat({ isWords, isPin })
  const alt = `Strength card: my new ${what} would take ${card.time} to guess. ${
    card.tierName
  }, about ${Math.round(bits)} bits. The password is not shown.`

  const copyText = async (prefix = '') => {
    try {
      await navigator.clipboard.writeText(card.text)
      setStatus(`${prefix}Share text copied — no password in it.`)
    } catch {
      setStatus('Couldn’t reach the clipboard.')
    }
  }

  const share = async () => {
    setBusy(true)
    try {
      const png = await cardPng(card.args)
      if (png && typeof navigator.canShare === 'function') {
        const file = new File([png], 'passlore-strength.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: card.text }).catch(() => {})
          return
        }
      }
      if (typeof navigator.share === 'function') {
        await navigator.share({ text: card.text, url: 'https://passlore.com' }).catch(() => {})
        return
      }
      await copyText('Sharing isn’t available here, so the text was copied. ')
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    setBusy(true)
    const png = await cardPng(card.args)
    setBusy(false)
    if (!png) {
      setStatus('Couldn’t make the image here. Copy the text instead.')
      return
    }
    saveBlob(png, 'passlore-strength.png')
    setStatus('Saved the strength card. The password isn’t on it.')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        setStatus('')
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!Number.isFinite(bits) || bits <= 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-accent px-3.5 text-sm font-bold text-on-accent shadow-[3px_3px_0_var(--primary)] transition-transform duration-[80ms] ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Export size={16} weight="bold" aria-hidden="true" />
          Share the strength
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Flex the strength, not the password</DialogTitle>
          <DialogDescription>
            This card shows how long your password would take to guess. The password itself is not on it and never
            leaves this device.
          </DialogDescription>
        </DialogHeader>
        <div className={s.scw}>
          <div className={s.shareCard} role="img" aria-label={alt}>
            <div className={s.scIn}>
              <div>
                <p className={s.scEyebrow}>My new {what}</p>
                <p className={s.scBig}>
                  would take <span className={s.scTime}>{card.time}</span> to guess.
                </p>
                <p className={s.scSub}>{card.sub}</p>
              </div>
              <div className={s.scLore}>
                <Lore mood={card.look.mood} scene={card.look.scene} size={220} animate={false} />
              </div>
            </div>
            <div className={s.scFoot}>
              <span className={s.scMark}>
                <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
                  <path fill="#0B0D17" fillRule="evenodd" d={LOGO_MARK} />
                </svg>
                passlore.com
              </span>
              <span>Made on my device · never uploaded</span>
            </div>
          </div>
        </div>
        <p className="m-0 text-[13px] text-ink-3">
          Estimate: average time at 100 billion guesses a second against a fast-hashed leak. It assumes the password
          is used in one place only.
        </p>
        <DialogFooter className="gap-2.5">
          <button type="button" onClick={share} disabled={busy} className={cn(btnPrimary, 'flex-[1.2]')}>
            <Export size={20} aria-hidden="true" />
            Share
          </button>
          <button type="button" onClick={save} disabled={busy} className={cn(btnSecondary, 'flex-1')}>
            <DownloadSimple size={20} aria-hidden="true" />
            Save image
          </button>
          <button type="button" onClick={() => copyText()} className={cn(btnSecondary, 'flex-1')}>
            <Copy size={20} aria-hidden="true" />
            Copy text
          </button>
        </DialogFooter>
        <p role="status" aria-live="polite" className="m-0 min-h-5 text-sm font-semibold text-ink-2">
          {status}
        </p>
      </DialogContent>
    </Dialog>
  )
}
