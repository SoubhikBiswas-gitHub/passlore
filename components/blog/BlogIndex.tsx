"use client"

import { useState } from "react"
import Link from "next/link"
import { Notebook } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { btn, card, forTag, pill, tinyTicket } from "@/components/content/styles"
import { CATEGORIES, type HeroTicket } from "./postMeta"

export type BlogCard = {
  slug: string
  title: string
  description: string
  readingTime: string
  date: string
  category: string
  recipe: string
  motif: string
  featured: boolean
  tickets: HeroTicket[]
}

const catLabel = "text-[13px] font-bold text-link"

export function BlogIndex({ posts, hero }: { posts: BlogCard[]; hero: React.ReactNode }) {
  const [cat, setCat] = useState<string>("All")
  const featured = posts.find((p) => p.featured)
  const showFeatured = featured && (cat === "All" || cat === featured.category)
  const shown = posts.filter((p) => !p.featured && (cat === "All" || p.category === cat))

  return (
    <>
      <section aria-labelledby="bl-h" className="relative flex flex-col gap-4 pb-8 pt-8 md:pb-12 md:pt-16">
        {hero}
        <div role="group" aria-label="Filter by topic" className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className={pill} aria-pressed={c === cat} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </section>
      <p className="sr-only" role="status" aria-live="polite">
        {cat === "All" ? "Showing all articles" : `Showing ${cat}`}
      </p>

      <section aria-label={cat === "All" ? "All articles" : `Articles in ${cat}`} className="flex flex-col gap-6 pt-10">
        {showFeatured && featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className={cn(card, "grid grid-cols-1 overflow-hidden text-ink no-underline transition-shadow duration-200 ease-calm hover:shadow-e2 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]")}
          >
            <span aria-hidden className="flex min-h-[300px] flex-col justify-center gap-3.5 bg-bg p-9">
              {featured.tickets.map((t, i) => (
                <span
                  key={t.tag}
                  className={cn(tinyTicket, "max-w-[420px]", i % 2 ? "rotate-[1.5deg] self-end" : "-rotate-2")}
                >
                  <span className={forTag}>{t.tag}</span>
                  <span className="font-mono text-[22px] leading-[1.3] [overflow-wrap:anywhere]">{t.value}</span>
                </span>
              ))}
            </span>
            <span className="flex flex-col justify-center gap-3 p-8">
              <span className={cn(catLabel, "text-sm")}>{featured.category} · Featured</span>
              <span className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] md:text-4xl">
                {featured.title}
              </span>
              <span className="text-[17px] text-ink-2">{featured.description}</span>
              <span className="text-[13px] text-ink-3">
                {featured.readingTime} · {featured.date}
              </span>
            </span>
          </Link>
        ) : null}

        {shown.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={cn(card, "group flex flex-col overflow-hidden text-ink no-underline transition-shadow duration-200 ease-calm hover:shadow-e2")}
              >
                <span
                  aria-hidden
                  className="relative block h-[164px] overflow-hidden bg-primary-soft text-on-primary-soft"
                >
                  <svg
                    viewBox="0 0 320 164"
                    preserveAspectRatio="xMidYMid slice"
                    className="block size-full transition-transform duration-500 ease-calm group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                  >
                    <path d={p.motif} fill="currentColor" />
                  </svg>
                </span>
                <span className="flex flex-1 flex-col gap-2 p-[18px]">
                  <span className={catLabel}>{p.category}</span>
                  <span className="text-[19px] font-semibold leading-[1.3] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[3px]">
                    {p.title}
                  </span>
                  <span className="text-[15px] text-ink-2">{p.description}</span>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="text-[13px] text-ink-3">{p.readingTime}</span>
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[13px] font-bold text-on-primary-soft">
                      Recipe: {p.recipe}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : null}

        {!shown.length && !showFeatured ? (
          <div className={cn(card, "flex flex-col items-center gap-2.5 px-6 py-10 text-center")}>
            <Notebook className="size-8 text-ink-3" aria-hidden />
            <p className="m-0 text-[19px] font-semibold">Nothing in {cat} yet.</p>
            <p className="m-0 max-w-[440px] text-ink-2">
              We only publish when there’s something worth explaining. The other topics have plenty to read.
            </p>
            <button type="button" className={btn.secondary} onClick={() => setCat("All")}>
              Show all articles
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}
