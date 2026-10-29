import Link from "next/link"
import { Lore } from "@/components/Lore"
import { TocMobile, TocSide, type TocItem } from "@/components/content/Toc"
import { h1Hero, lede, pill, prose, wrap } from "@/components/content/styles"
import { getBreadcrumbSchema, SITE_URL } from "@/lib/seo"

export type LegalSectionData = { id: string; h: string; body: React.ReactNode }

export const LEGAL_UPDATED = { iso: "2026-10-30", label: "Friday, 30 October 2026" }

const docs = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const

export function LegalShell({
  doc,
  title,
  intro,
  sections,
  before,
  after,
}: {
  doc: "/privacy" | "/terms"
  title: string
  intro: string
  sections: LegalSectionData[]
  before?: React.ReactNode
  after?: React.ReactNode
}) {
  const toc: TocItem[] = sections.map((s) => ({ id: s.id, label: s.h }))
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: title, url: `${SITE_URL}${doc}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <section className="bg-bg text-ink">
        <div className={`${wrap} relative flex flex-col gap-4 py-8 md:pb-12 md:pt-14`}>
          <div className="absolute bottom-5 right-8 hidden leading-none lg:block" aria-hidden>
            <Lore mood="happy" scene="shield" size={230} />
          </div>
          <nav aria-label="Legal documents" className="flex gap-2">
            {docs.map((d) => (
              <Link key={d.href} href={d.href} className={pill} aria-current={d.href === doc ? "page" : undefined}>
                {d.label}
              </Link>
            ))}
          </nav>
          <h1 className={h1Hero}>{title}</h1>
          <p className={lede}>{intro}</p>
          <p className="m-0 text-sm text-ink-2">
            Last updated <time dateTime={LEGAL_UPDATED.iso}>{LEGAL_UPDATED.label}</time> · Passlore
          </p>
        </div>
      </section>

      <TocMobile items={toc} />

      <div className={`${wrap} grid grid-cols-1 gap-14 pb-24 pt-6 lg:grid-cols-[240px_minmax(0,1fr)]`}>
        <TocSide items={toc} className="pt-10" />
        <div className={`${prose} max-w-[760px]`}>
          {before}
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.h}</h2>
              {s.body}
            </section>
          ))}
          {after}
        </div>
      </div>
    </>
  )
}
