'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, DownloadSimple, Warning } from '@phosphor-icons/react'

import { cn } from '@/lib/utils'

type Format = 'txt' | 'csv' | 'json'

const formats: { id: Format; name: string; mime: string }[] = [
  { id: 'txt', name: '.txt', mime: 'text/plain' },
  { id: 'csv', name: '.csv', mime: 'text/csv' },
  { id: 'json', name: '.json', mime: 'application/json' },
]

const btn =
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border px-[18px] text-[15px] font-semibold transition-[background-color,border-color,transform] duration-75 ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55'
const pick =
  'min-h-11 min-w-[52px] rounded-sm border border-line-strong bg-surface px-3 text-sm font-semibold text-ink aria-pressed:border-[3px] aria-pressed:border-primary aria-pressed:bg-primary-soft aria-pressed:text-on-primary-soft'

function serialise(list: string[], fmt: Format) {
  if (fmt === 'json') return JSON.stringify({ count: list.length, passwords: list }, null, 2)
  if (fmt === 'csv') return `n,password\n${list.map((v, i) => `${i + 1},"${v.replace(/"/g, '""')}"`).join('\n')}\n`
  return `${list.join('\n')}\n`
}

export function BulkList({
  items,
  length,
  revealed = true,
  onCopy,
}: {
  items: string[]
  length: number
  revealed?: boolean
  onCopy: (value: string) => Promise<boolean>
}) {
  const [fmt, setFmt] = useState<Format>('txt')
  const [copied, setCopied] = useState<number | 'all' | null>(null)
  const [status, setStatus] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const markCopied = (key: number | 'all') => {
    setCopied(key)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 1600)
  }

  const download = () => {
    const f = formats.find((x) => x.id === fmt) ?? formats[0]
    const name = `passlore-${items.length}.${f.id}`
    const url = URL.createObjectURL(new Blob([serialise(items, fmt)], { type: f.mime }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
    setStatus(`Saving ${name} — a plain, unencrypted file. Delete it once everyone has theirs.`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Export as" className="flex flex-wrap items-center gap-2">
        <span aria-hidden="true" className="mr-1 text-sm font-semibold text-ink-2">
          Export as
        </span>
        {formats.map((f) => (
          <button key={f.id} type="button" aria-pressed={fmt === f.id} onClick={() => setFmt(f.id)} className={pick}>
            {f.name}
          </button>
        ))}
      </div>

      <p className="m-0 text-[13px] text-ink-3">
        {items.length} {items.length === 1 ? 'password' : 'passwords'}, {length} characters each
      </p>

      <ol
        aria-label="Generated passwords"
        className="m-0 max-h-80 list-none overflow-y-auto rounded-md border border-line p-0"
      >
        {items.map((value, i) => (
          <li
            key={i}
            className="grid min-h-11 grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-2 border-b border-line py-0 pl-3 pr-1.5 [contain-intrinsic-size:auto_45px] [content-visibility:auto] last:border-b-0"
          >
            <span aria-hidden="true" className="font-mono text-[13px] text-ink-3">
              {i + 1}
            </span>
            <span className="py-2.5 font-mono text-[15px] text-ink [overflow-wrap:anywhere]">
              {revealed ? value : '•'.repeat(value.length)}
            </span>
            <button
              type="button"
              aria-label={`Copy password ${i + 1}`}
              onClick={() => {
                onCopy(value).then((ok) => ok && markCopied(i))
              }}
              className="inline-flex size-11 items-center justify-center rounded-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
            >
              {copied === i ? (
                <Check size={20} weight="bold" aria-hidden="true" className="text-success" />
              ) : (
                <Copy size={20} aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ol>

      <p className="m-0 flex gap-1.5 text-[13px] text-ink-3">
        <Warning size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-warning" />
        Files are plain and unencrypted. Hand the passwords over, then delete the file.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={download}
          disabled={!items.length}
          className={cn(btn, 'border-transparent bg-primary text-on-primary hover:bg-primary-hover')}
        >
          <DownloadSimple size={20} aria-hidden="true" />
          Download {items.length} as .{fmt}
        </button>
        <button
          type="button"
          onClick={() => {
            onCopy(items.join('\n')).then((ok) => ok && markCopied('all'))
          }}
          disabled={!items.length}
          className={cn(btn, 'border-line-strong bg-surface text-ink hover:bg-surface-2')}
        >
          {copied === 'all' ? <Check size={20} weight="bold" aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
          {copied === 'all' ? 'Copied all' : 'Copy all'}
        </button>
      </div>

      <p role="status" aria-live="polite" className={cn('m-0 text-sm font-semibold text-ink-2', !status && 'sr-only')}>
        {status}
      </p>
    </div>
  )
}
