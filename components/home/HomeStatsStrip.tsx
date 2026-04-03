export function HomeStatsStrip() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-px mt-px bg-zinc-800">
      <div className="bg-[#18181b] p-8">
        <div className="text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 mb-2">Passwords generated</div>
        <div className="text-3xl sm:text-4xl font-headline font-bold text-zinc-50">142,891,003</div>
        <div className="mt-4 text-xs font-mono text-zinc-600 uppercase tracking-tighter">
          Global counter (illustrative)
        </div>
      </div>
      <div className="bg-[#18181b] p-8 border-x border-zinc-800/80">
        <div className="text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 mb-2">Encryption standard</div>
        <div className="text-3xl sm:text-4xl font-headline font-bold text-zinc-50">NIST SP 800-63</div>
        <div className="mt-4 text-xs font-mono text-zinc-600 uppercase tracking-tighter">
          Compliance level: high
        </div>
      </div>
      <div className="bg-[#18181b] p-8">
        <div className="text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 mb-2">Avg search depth</div>
        <div className="text-3xl sm:text-4xl font-headline font-bold text-zinc-50">2^128 ops</div>
        <div className="mt-4 text-xs font-mono text-zinc-600 uppercase tracking-tighter">
          Exhaustive search resistant
        </div>
      </div>
    </section>
  )
}
