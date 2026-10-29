import Link from "next/link"
import type { Metadata } from "next"
import { Lore } from "@/components/Lore"
import { FreshTicket } from "@/components/content/FreshTicket"
import { RecipeDeck } from "@/components/content/RecipeDeck"
import { eyebrow, wrap } from "@/components/content/styles"
import { SITE_NAME } from "@/lib/seo"

export const metadata: Metadata = {
  title: `Page not found — ${SITE_NAME}`,
  robots: { index: false, follow: true },
}

const big4 =
  "hidden font-display text-[84px] font-extrabold leading-[0.85] tracking-[-0.06em] text-bg [-webkit-text-stroke:4px_var(--text-2)] [paint-order:stroke_fill] sm:block md:text-[150px]"

export default function NotFound() {
  return (
    <section aria-labelledby="nf-h" className="bg-bg pb-[72px] text-ink">
      <div className={`${wrap} flex flex-col items-center gap-[18px] pt-14 text-center`}>
        <div className="flex items-center gap-2">
          <span className={big4} aria-hidden>
            4
          </span>
          <Lore
            mood="shocked"
            scene="lock"
            size={230}
            label="Lore the key, puzzled in front of a lock it doesn’t fit"
          />
          <span className={big4} aria-hidden>
            4
          </span>
        </div>
        <p className={`${eyebrow} sm:hidden`}>Error 404</p>
        <h1
          id="nf-h"
          className="m-0 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance md:text-[56px]"
        >
          This key doesn’t fit any page.
        </h1>
        <p className="m-0 max-w-[560px] text-lg text-ink-2 md:text-[19px]">
          The link may be old or mistyped. Nothing was generated or sent. Here’s a fresh password while you’re here:
        </p>
        <FreshTicket />
        <h2 className="m-0 mt-8 font-display text-[26px] font-bold tracking-[-0.02em]">
          Or tell us where the password is going
        </h2>
        <RecipeDeck />
        <p className="m-0 mt-2 text-base text-ink-2">
          Looking for something to read?{" "}
          <Link href="/how-it-works" className="text-ink underline underline-offset-[3px] hover:decoration-2">
            How it works
          </Link>{" "}
          ·{" "}
          <Link href="/blog" className="text-ink underline underline-offset-[3px] hover:decoration-2">
            Blog
          </Link>
        </p>
      </div>
    </section>
  )
}
