'use client'

import { useMemo, useState } from 'react'
import { ArrowsOut, Printer, WifiHigh } from '@phosphor-icons/react'

import { Lore } from '@/components/Lore'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { qrMatrix, wifiPayload } from '@/lib/generator'
import { cn } from '@/lib/utils'

const btn =
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-[18px] text-[15px] font-semibold transition-[background-color,border-color,transform] duration-75 ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55'
const btnSecondary = cn(btn, 'border-line-strong bg-surface text-ink hover:bg-surface-2')
const btnPrimary = cn(btn, 'border-transparent bg-primary text-on-primary hover:bg-primary-hover')

const sepNames: Record<string, string> = { '-': 'a hyphen', ' ': 'a space', '.': 'a dot', _: 'an underscore' }

const printCss = `@media print {
  @page { size: A5; margin: 0; }
  body * { visibility: hidden !important; }
  .pl-poster, .pl-poster * { visibility: visible !important; }
  .pl-poster { position: fixed !important; left: 0; top: 0; width: 148mm !important; box-shadow: none !important; }
  .pl-poster-layer { transform: none !important; animation: none !important; }
  .pl-no-print { display: none !important; }
}`

function QrSvg({ matrix, size, label }: { matrix: boolean[][]; size: number; label: string }) {
  const n = matrix.length
  const d = useMemo(() => {
    const parts: string[] = []
    matrix.forEach((row, y) => row.forEach((on, x) => on && parts.push(`M${x} ${y}h1v1h-1z`)))
    return parts.join('')
  }, [matrix])
  return (
    <svg
      viewBox={`-4 -4 ${n + 8} ${n + 8}`}
      width={size}
      height={size}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className="block max-w-full"
    >
      <rect x={-4} y={-4} width={n + 8} height={n + 8} fill="#FFFFFF" />
      <path d={d} fill="#0B0D17" />
    </svg>
  )
}

function splitForReading(password: string) {
  const sep = password.match(/[ \-._]/)?.[0]
  if (sep && /^[A-Za-z0-9]+(?:[ \-._][A-Za-z0-9]+)+$/.test(password)) {
    return {
      parts: password.split(/[ \-._]/),
      hint: `One word per line, in order. Type ${sepNames[sep] ?? 'the separator'} between words.`,
    }
  }
  return { parts: password.match(/.{1,4}/g) ?? [], hint: 'Groups of four, in order. Type them without spaces.' }
}

export function WifiQr({ ssid, password }: { ssid: string; password: string }) {
  const [bigOpen, setBigOpen] = useState(false)
  const [posterOpen, setPosterOpen] = useState(false)

  const matrix = useMemo(() => {
    if (!password || !ssid.trim()) return null
    try {
      return qrMatrix(wifiPayload(ssid, password))
    } catch {
      return null
    }
  }, [ssid, password])

  const name = ssid.trim()
  const qrLabel = name ? `QR code to join ${name}` : 'QR code to join this Wi-Fi network. Add the network name first.'
  const reading = useMemo(() => splitForReading(password), [password])

  return (
    <figure className="m-0 flex w-full flex-col items-center gap-2 rounded-[16px] border border-line bg-white p-3.5 text-[#0B0D17]">
      {matrix ? (
        <QrSvg matrix={matrix} size={200} label={qrLabel} />
      ) : (
        <div className="flex size-[200px] items-center justify-center rounded-md border-2 border-dashed border-[#737A8C] p-4 text-center text-sm text-[#383D4D]">
          Cut a password to draw the QR code
        </div>
      )}
      <figcaption className="text-center text-[13px] text-[#383D4D]">
        {name ? (
          <>Scan to join {name}</>
        ) : (
          <span className="font-semibold text-[#8A5A00]">
            Add the network name so phones know which network to join
          </span>
        )}
      </figcaption>

      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={() => setBigOpen(true)}
          disabled={!password}
          className={cn(btn, 'w-full border-[#737A8C] bg-white px-3 text-sm text-[#0B0D17] hover:bg-[#F3F4F8]')}
        >
          <ArrowsOut size={20} aria-hidden="true" />
          Show big
        </button>
        <button
          type="button"
          onClick={() => setPosterOpen(true)}
          disabled={!matrix}
          className={cn(btn, 'w-full border-[#737A8C] bg-white px-3 text-sm text-[#0B0D17] hover:bg-[#F3F4F8]')}
        >
          <Printer size={20} aria-hidden="true" />
          Guest poster
        </button>
      </div>

      <Dialog open={bigOpen} onOpenChange={setBigOpen}>
        <DialogContent
          variant="full"
          showClose={false}
          className="flex flex-col bg-[var(--stage)] p-6 text-[var(--on-stage)]"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Password, shown big</DialogTitle>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-primary-soft px-3 text-sm font-bold text-on-primary-soft">
              <WifiHigh size={16} weight="bold" aria-hidden="true" />
              For · Wi-Fi{name ? ` · ${name}` : ''}
            </span>
            <DialogClose className="min-h-[52px] rounded-md bg-accent px-[22px] text-base font-bold text-on-accent">
              Done
            </DialogClose>
          </div>
          <ol className="mx-0 my-auto flex list-none flex-col items-start gap-1.5 px-0 py-8">
            {reading.parts.map((part, i) => (
              <li key={i} className="flex items-baseline gap-[18px]">
                <span aria-hidden="true" className="w-7 text-right font-mono text-xl text-[var(--on-stage-2)]">
                  {i + 1}
                </span>
                <span className="font-mono text-[clamp(40px,9vw,96px)] font-semibold leading-[1.05] tracking-[0.02em] [overflow-wrap:anywhere]">
                  {part}
                </span>
              </li>
            ))}
          </ol>
          <p className="m-0 text-base text-[var(--on-stage-2)]">{reading.hint}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={posterOpen} onOpenChange={setPosterOpen}>
        <DialogContent
          variant="bare"
          showClose={false}
          className="pl-poster-layer flex-col gap-3"
          onClick={(e) => e.target === e.currentTarget && setPosterOpen(false)}
        >
          <style>{printCss}</style>
          <DialogTitle className="sr-only">Guest Wi-Fi poster</DialogTitle>
          <DialogDescription className="sr-only">
            A printable poster with the QR code, network name and password.
          </DialogDescription>
          <div className="pl-poster flex aspect-[1/1.414] w-[min(420px,92vw)] shrink-0 flex-col overflow-hidden rounded-[22px] border-[3px] border-[#0B0D17] bg-white text-[#0B0D17] shadow-[8px_8px_0_#2447F5]">
            <div className="flex items-end justify-between gap-2 border-b-[3px] border-[#0B0D17] bg-[#C8FF2E] px-5 pb-1.5 pt-[18px]">
              <div className="pb-3">
                <p className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em]">Guests, welcome</p>
                <p className="m-0 mt-0.5 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em]">
                  Free
                  <br />
                  Wi-Fi
                </p>
              </div>
              <Lore mood="happy" scene="sparkles" size={130} animate={false} />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-5 py-3.5">
              {matrix && <QrSvg matrix={matrix} size={190} label={qrLabel} />}
              <p className="m-0 text-base font-extrabold">Point your camera here to join</p>
            </div>
            <div className="flex flex-col gap-1 border-t-2 border-dashed border-[#737A8C] px-5 pb-3.5 pt-3">
              <p className="m-0 text-xs font-bold text-[#545A6B]">NETWORK</p>
              <p className="m-0 text-[17px] font-extrabold [overflow-wrap:anywhere]">{name || '—'}</p>
              <p className="m-0 mt-1 text-xs font-bold text-[#545A6B]">PASSWORD</p>
              <p className="m-0 font-mono text-[15px] [overflow-wrap:anywhere]">{password}</p>
            </div>
            <div className="flex justify-between bg-[#0B0D17] px-5 py-2 text-xs font-bold text-white">
              <span>Made with passlore.com</span>
              <span>Cut on our device</span>
            </div>
          </div>
          <p className="pl-no-print m-0 max-w-[420px] rounded-md bg-[#0B0D17] px-3 py-2 text-center text-sm text-white">
            Anyone who can see this poster can join your network. Print it for guests only.
          </p>
          <div className="pl-no-print flex gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className={cn(btnPrimary, 'min-h-14 rounded-md px-6 text-[17px]')}
            >
              <Printer size={20} aria-hidden="true" />
              Print
            </button>
            <DialogClose className={cn(btnSecondary, 'min-h-14 rounded-md px-6 text-[17px]')}>Close</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </figure>
  )
}
