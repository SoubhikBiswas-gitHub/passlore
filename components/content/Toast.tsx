"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Info, Warning, X } from "@phosphor-icons/react"

export type ToastKind = "ok" | "error" | "info"

const ICONS = { ok: Check, error: Warning, info: Info } as const
const DURATION = 6000

export function useToast() {
  const [toast, setToast] = useState<{ text: string; kind: ToastKind }>({ text: "", kind: "info" })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const show = useCallback((text: string, kind: ToastKind = "info") => {
    setToast({ text, kind })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast((t) => ({ ...t, text: "" })), DURATION)
  }, [])
  const dismiss = useCallback(() => {
    clearTimeout(timer.current)
    setToast((t) => ({ ...t, text: "" }))
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { text: toast.text, kind: toast.kind, show, dismiss }
}

export function Toast({ text, kind = "info", onDismiss }: { text: string; kind?: ToastKind; onDismiss: () => void }) {
  const Icon = ICONS[kind]
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4"
      role="status"
      aria-live="polite"
    >
      {text ? (
        <div className="pointer-events-auto flex max-w-[520px] items-center gap-2.5 rounded-md bg-ink py-2.5 pl-4 pr-2 text-bg shadow-e3 animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out">
          <Icon className="size-5 shrink-0" aria-hidden />
          <span className="flex-1 text-[15px]">{text}</span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-inherit"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText)
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => false,
      )
    return Promise.resolve(false)
  } catch {
    return Promise.resolve(false)
  }
}
