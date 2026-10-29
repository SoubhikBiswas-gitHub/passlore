"use client"

import { useId, useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

type InstallState = "prompt" | "ios" | "none"

let deferred: InstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

// registered at module load so a prompt fired before the menu opens is not missed
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault()
    deferred = event as InstallPromptEvent
    emit()
  })
  window.addEventListener("appinstalled", () => {
    deferred = null
    installed = true
    emit()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getState(): InstallState {
  if (installed) return "none"
  if (deferred) return "prompt"
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  if (standalone) return "none"
  const ios =
    /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  return ios ? "ios" : "none"
}

const variants = {
  footer: {
    button:
      "self-start rounded-[10px] border border-[var(--stage-line)] bg-transparent px-3.5 text-sm text-[var(--on-stage)] hover:bg-[var(--stage-2)]",
    help: "text-sm text-[var(--on-stage-2)]",
  },
  menu: {
    button:
      "mt-3 w-full rounded-[10px] border border-line-strong bg-surface px-[18px] text-[15px] text-ink hover:bg-surface-2",
    help: "text-sm text-ink-2",
  },
}

export function InstallApp({ variant }: { variant: keyof typeof variants }) {
  const state = useSyncExternalStore(subscribe, getState, () => "none" as InstallState)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpId = useId()
  const style = variants[variant]

  if (state === "none") return null

  const install = async () => {
    if (state === "ios") {
      setHelpOpen((open) => !open)
      return
    }
    const event = deferred
    if (!event) return
    await event.prompt()
    await event.userChoice.catch(() => null)
    // a prompt can only be shown once; the browser fires a fresh event if it allows another try
    deferred = null
    emit()
  }

  return (
    <div className={cn("flex flex-col gap-2", variant === "footer" && "items-start")}>
      <button
        type="button"
        onClick={install}
        aria-expanded={state === "ios" ? helpOpen : undefined}
        aria-controls={state === "ios" ? helpId : undefined}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center justify-center font-semibold transition-colors duration-(--t-glide) ease-calm active:translate-y-px [[data-theme=hc]_&]:border-2 [[data-theme=hc]_&]:border-white",
          style.button
        )}
      >
        Install as an app
      </button>
      {state === "ios" && helpOpen && (
        <p id={helpId} className={cn("m-0 max-w-[340px]", style.help)}>
          In Safari, tap Share, then Add to Home Screen.
        </p>
      )}
    </div>
  )
}
