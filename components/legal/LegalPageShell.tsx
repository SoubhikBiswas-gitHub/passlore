import Image from "next/image"
import Link from "next/link"
import { Key } from "@phosphor-icons/react/dist/ssr"
import { TocScrollNav } from "@/components/TocScrollNav"

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

      <div className="bg-background text-foreground min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <aside className="lg:col-span-3 mb-12 lg:mb-0 lg:sticky lg:top-24 space-y-8">
              <p className="text-[0.6875rem] uppercase tracking-widest text-primary font-headline font-bold">
                {documentLabel}
              </p>
              <TocScrollNav items={toc} heading="On this page" />

              <div className="p-4 bg-card border border-border space-y-2 font-mono text-[11px] text-secure-fg leading-relaxed">
                {statusLines.map((line, i) => (
                  <p key={`${i}-${line.slice(0, 24)}`} className="uppercase tracking-wide">
                    {line}
                  </p>
                ))}
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-primary hover:text-primary/90"
              >
                <Key className="size-4" weight="bold" aria-hidden />
                Back to generator
              </Link>
            </aside>

            <article className="lg:col-span-9">
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                <span className="text-foreground">{titleLine} </span>
                <span className="text-violet-400">{titleAccent}</span>
              </h1>
              <p className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground font-mono mb-10">
                {lastUpdatedLabel}
              </p>

              <div className="relative aspect-[21/9] w-full mb-12 border border-border overflow-hidden bg-muted">
                <Image
                  src={heroImageSrc}
                  alt={heroImageAlt}
                  fill
                  className="object-cover opacity-80 grayscale-[0.35] hover:grayscale-[0.15] transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
                <div
                  className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/90 via-transparent to-transparent"
                  aria-hidden
                />
              </div>

              <div className="space-y-0">{children}</div>

              <div className="mt-16 pt-10 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Related</p>
                <Link
                  href={crossLinkHref}
                  className="inline-flex items-center gap-2 text-sm font-headline uppercase tracking-widest text-primary hover:text-primary/90 border-b border-primary/30 pb-1"
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
              className="inline-flex items-center justify-center px-6 py-3 bg-background text-foreground font-headline text-xs font-bold uppercase tracking-widest hover:bg-accent border border-foreground/15 transition-colors shrink-0"
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
      className={`scroll-mt-28 ${isFirst ? "pb-12" : "border-t border-border py-12"}`}
    >
      <h2 className="font-headline text-sm font-bold uppercase tracking-[0.14em] text-foreground mb-5">
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-4 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline-offset-2 [&_a]:hover:underline">
        {children}
      </div>
    </section>
  )
}
