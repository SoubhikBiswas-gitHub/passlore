import { ShieldCheck, EyeSlash, Terminal } from "@phosphor-icons/react/dist/ssr"

export function HomeHero() {
  return (
    <section className="mb-16 text-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-zinc-950 border border-zinc-800 mb-8">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" aria-hidden />
          <ShieldCheck className="text-green-400 size-[14px]" weight="fill" aria-hidden />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-zinc-400 font-bold">
          Military-grade entropy engine
        </span>
        <div className="hidden sm:block w-px h-3 bg-zinc-800" aria-hidden />
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-blue-500 font-bold">
          v2.4.0-stable
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-headline font-bold tracking-[0.08em] text-zinc-50 mb-6 leading-[1.05] uppercase">
        Free strong
        <br />
        password generator
      </h1>
      <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-12">
        Generate cryptographically secure passwords locally in your browser. No data ever leaves your device.
        Precision brutalism for absolute security.
      </p>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <div className="flex items-center gap-2.5 px-5 py-3 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors">
          <ShieldCheck className="text-blue-500 size-5 shrink-0" weight="fill" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Zero-knowledge</span>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors">
          <EyeSlash className="text-blue-500 size-5 shrink-0" weight="fill" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-300">No trackers</span>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors">
          <Terminal className="text-blue-500 size-5 shrink-0" weight="bold" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-300">Open-source</span>
        </div>
      </div>
    </section>
  )
}
