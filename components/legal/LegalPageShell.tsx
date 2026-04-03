import Image from "next/image"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export interface LegalTocItem {
  id: string
  label: string
}

interface LegalPageShellProps {
  breadcrumbJsonLd: string
  documentLabel: string
  titleLine: string
  titleAccent: string
  lastUpdatedLabel: string
  heroImageSrc: string
  heroImageAlt: string
  toc: readonly LegalTocItem[]
  statusLines: readonly string[]
  crossLinkHref: string
  crossLinkText: string
  children: React.ReactNode
}

export function LegalPageShell({
  breadcrumbJsonLd,
  documentLabel,
  titleLine,
  titleAccent,
  lastUpdatedLabel,
  heroImageSrc,
  heroImageAlt,
  toc,
  statusLines,
  crossLinkHref,
  crossLinkText,
  children,
}: LegalPageShellProps) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

      <div className="bg-[#0a0a0a] text-zinc-50 min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <p className="text-[0.6875rem] uppercase tracking-widest text-blue-500 font-headline font-bold">
                {documentLabel}
              </p>
              <nav aria-label="On this page">
                <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-headline font-bold mb-4">
                  On this page
                </p>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-zinc-400 hover:text-blue-400 transition-colors font-mono leading-snug"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 bg-[#18181b] border border-zinc-800 space-y-2 font-mono text-[11px] text-emerald-400/90 leading-relaxed">
                {statusLines.map((line, i) => (
                  <p key={`${i}-${line.slice(0, 24)}`} className="uppercase tracking-wide">
                    {line}
                  </p>
                ))}
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-blue-500 hover:text-blue-400"
              >
                <Plus className="size-4" weight="bold" aria-hidden />
                Back to generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                <span className="text-zinc-50">{titleLine} </span>
                <span className="text-violet-400">{titleAccent}</span>
              </h1>
              <p className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-mono mb-10">
                {lastUpdatedLabel}
              </p>

              <div className="relative aspect-[21/9] w-full mb-12 border border-zinc-800 overflow-hidden bg-zinc-900">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  className="object-cover opacity-80 grayscale-[0.35] hover:grayscale-[0.15] transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
                <div
                  className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-transparent"
                  aria-hidden
                />
              </div>

              <div className="space-y-0">{children}</div>

              <div className="mt-16 pt-10 border-t border-zinc-800">
                <p className="text-sm text-zinc-500 mb-4">Related</p>
                <Link
                  href={crossLinkHref}
                  className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-blue-500 hover:text-blue-400 border-b border-blue-500/30 pb-1"
                >
                  {crossLinkText}
                </Link>
              </div>
            </article>
          </div>
        </div>

        <section className="bg-blue-600 border-t border-blue-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="font-headline text-sm font-bold text-white uppercase tracking-[0.1em] max-w-lg">
              Questions about this document? We respond to security and privacy inquiries as a priority.
            </p>
            <Link
              href="mailto:privacy@securepass.pro"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-zinc-950 font-headline text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors shrink-0"
            >
              Contact
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export function LegalSection({
  id,
  title,
  children,
  isFirst,
}: {
  id: string
  title: string
  children: React.ReactNode
  isFirst?: boolean
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 ${isFirst ? "pb-12" : "border-t border-zinc-800 py-12"}`}
    >
      <h2 className="font-headline text-sm font-bold uppercase tracking-[0.14em] text-zinc-200 mb-5">
        {title}
      </h2>
      <div className="text-sm text-zinc-400 leading-relaxed space-y-4 [&_strong]:text-zinc-200 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-blue-400 [&_a]:underline-offset-2 [&_a]:hover:underline">
        {children}
      </div>
    </section>
  )
}
