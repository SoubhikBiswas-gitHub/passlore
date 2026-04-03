import { Cpu, MagnifyingGlass, Scales } from "@phosphor-icons/react/dist/ssr"
import type { ReactNode } from "react"

interface ISpecCardProps {
  readonly id: string
  readonly label: string
  readonly title: string
  readonly detail: string
  readonly icon: ReactNode
}

function SpecCard({ id, label, title, detail, icon }: ISpecCardProps) {
  return (
    <article
      className="group relative flex flex-col gap-4 border border-border bg-card p-6 sm:p-7 transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-primary/40 hover:bg-accent-2 hover:shadow-[0_1px_0_0_hsl(var(--primary)/0.14)] motion-reduce:transition-colors motion-reduce:hover:shadow-none focus-within:border-primary/55 focus-within:bg-accent-2/80"
      aria-labelledby={id}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/60 text-primary transition-[border-color,background-color] duration-200 ease-out group-hover:border-primary/45 group-hover:bg-accent-3/25 group-hover:text-primary motion-reduce:group-hover:bg-primary/8"
        aria-hidden
      >
        <span className="flex size-full items-center justify-center motion-safe:origin-center motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:motion-safe:scale-110">
          {icon}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="ds-text-label-sm tracking-[0.2em] text-muted-foreground">{label}</div>
        <h3 id={id} className="text-xl sm:text-2xl font-headline font-bold text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-tighter leading-relaxed">
          {detail}
        </p>
      </div>
    </article>
  )
}

export function HomeStatsStrip() {
  return (
    <section className="mt-10 sm:mt-12 md:mt-14" aria-labelledby="home-specs-heading">
      <h2 id="home-specs-heading" className="sr-only">
        Cryptographic and privacy specifications
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-5 lg:gap-6">
      <SpecCard
        id="spec-randomness-source"
        label="Randomness source"
        title="Web Crypto API"
        detail="crypto.getRandomValues — uniform indices via rejection sampling"
        icon={<Cpu className="size-7" weight="duotone" />}
      />
      <SpecCard
        id="spec-guidance-alignment"
        label="Guidance alignment"
        title="NIST SP 800-63B-style"
        detail="Long secrets, optional breach check — not a formal certification"
        icon={<Scales className="size-7" weight="duotone" />}
      />
      <SpecCard
        id="spec-breach-check"
        label="Breach check"
        title="HIBP k-anonymity"
        detail="SHA-1 hash prefix only; plaintext stays in your browser"
        icon={<MagnifyingGlass className="size-7" weight="duotone" />}
      />
      </div>
    </section>
  )
}
