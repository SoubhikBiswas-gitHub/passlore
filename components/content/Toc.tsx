"use client"

import { useEffect, useState } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { card, wrap } from "./styles"

export type TocItem = { id: string; label: string }

const ACTIVE_LINE = 160

function useActiveId(items: readonly TocItem[]) {
  const [active, setActive] = useState(items[0]?.id ?? "")
  useEffect(() => {
    const update = () => {
      let cur = items[0]?.id ?? ""
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top < ACTIVE_LINE) cur = item.id
      }
      setActive(cur)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [items])
  return active
}

const linkClass =
  "flex min-h-11 items-center border-l-2 border-line px-3 text-[15px] text-ink-2 no-underline transition-colors duration-150 ease-calm hover:text-ink aria-[current=true]:border-primary aria-[current=true]:font-semibold aria-[current=true]:text-ink"

function Links({ items, active }: { items: readonly TocItem[]; active: string }) {
  return (
    <>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={item.id === active ? "true" : undefined}
          className={linkClass}
        >
          {item.label}
        </a>
      ))}
    </>
  )
}

export function TocSide({ items, className = "" }: { items: readonly TocItem[]; className?: string }) {
  const active = useActiveId(items)
  return (
    <nav aria-label="On this page" className={`sticky top-6 hidden flex-col self-start lg:flex ${className}`}>
      <p className="mb-2 text-sm font-semibold text-ink-2">On this page</p>
      <Links items={items} active={active} />
    </nav>
  )
}

export function TocMobile({ items }: { items: readonly TocItem[] }) {
  const active = useActiveId(items)
  return (
    <div className={`${wrap} lg:hidden`}>
      <details className={`${card} group mt-6 px-4 py-1 text-base`}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
          On this page
          <CaretDown className="size-5 transition-transform duration-200 ease-calm group-open:rotate-180" aria-hidden />
        </summary>
        <nav aria-label="On this page" className="flex flex-col pb-3">
          <Links items={items} active={active} />
        </nav>
      </details>
    </div>
  )
}
