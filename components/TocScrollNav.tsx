"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface ITocItem {
  id: string
  label: string
}

interface ITocScrollNavProps {
  items: readonly ITocItem[]
  heading?: string
}

/** ~7rem scroll-margin + fixed header — section “counts” when its top passes this line */
const ACTIVATION_LINE_PX = 112

function computeActiveId(ids: readonly string[]): string | null {
  if (ids.length === 0 || typeof document === "undefined") return null

  let current: string | null = null
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    if (top <= ACTIVATION_LINE_PX) current = id
  }

  if (current === null) return ids[0] ?? null

  const scrollBottom = window.scrollY + window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  if (scrollBottom >= docHeight - 2) {
    return ids[ids.length - 1] ?? current
  }

  return current
}

export function TocScrollNav({ items, heading = "On this page" }: ITocScrollNavProps) {
  const ids = items.map((i) => i.id)
  const idsFingerprint = ids.join("\u001f")
  const [activeId, setActiveId] = useState<string | null>(() => ids[0] ?? null)
  const rafRef = useRef<number | null>(null)
  const idsRef = useRef(ids)
  idsRef.current = ids

  const sync = useCallback(() => {
    const next = computeActiveId(idsRef.current)
    if (next !== null) {
      setActiveId((prev) => (prev === next ? prev : next))
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const onScrollOrResize = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        sync()
      })
    }

    const onHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && idsRef.current.includes(hash)) {
        setActiveId(hash)
        return
      }
      sync()
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize, { passive: true })
    window.addEventListener("hashchange", onHashChange)

    const elements = idsRef.current
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer =
      elements.length > 0
        ? new IntersectionObserver(onScrollOrResize, {
            root: null,
            rootMargin: `-${ACTIVATION_LINE_PX}px 0px -40% 0px`,
            threshold: [0, 0.01, 0.25, 0.5, 1],
          })
        : null

    elements.forEach((el) => observer?.observe(el))

    const initialHash = window.location.hash.slice(1)
    if (initialHash && idsRef.current.includes(initialHash)) {
      setActiveId(initialHash)
    } else {
      sync()
    }

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      window.removeEventListener("hashchange", onHashChange)
      observer?.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [idsFingerprint, sync])

  return (
    <nav aria-label={heading}>
      <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-headline font-bold mb-4">
        {heading}
      </p>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "text-sm transition-colors font-mono leading-snug",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
