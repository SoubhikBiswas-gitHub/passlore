interface RealtimeMetricsPanelProps {
  sessionCount: number
}

export function RealtimeMetricsPanel({ sessionCount }: RealtimeMetricsPanelProps) {
  const salts = Math.min(1024, 64 + sessionCount * 37)
  const cpuPct = (22 + (sessionCount % 5) * 0.35 + (sessionCount % 3) * 0.12).toFixed(1)

  return (
    <div className="shrink-0 border-t border-border bg-card p-4 sm:p-5">
      <h3 className="mb-3 text-[0.6875rem] font-bold uppercase tracking-widest text-foreground/90">
        Real-time metrics
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2">
        <div className="flex flex-col justify-between gap-1 border border-border bg-muted p-2.5 sm:min-h-0">
          <span className="text-[11px] font-mono uppercase text-foreground/90">Session ID</span>
          <span className="min-w-[3ch] text-right text-lg font-mono tabular-nums text-foreground sm:text-left">
            {sessionCount}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-1 border border-border bg-muted p-2.5 sm:min-h-0">
          <span className="text-[11px] font-mono uppercase text-foreground/90">Unique salt</span>
          <span className="min-w-[4ch] text-right text-lg font-mono tabular-nums text-foreground sm:text-left">
            {salts.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-1 border border-border bg-muted p-2.5 sm:min-h-0">
          <span className="text-[11px] font-mono uppercase text-foreground/90">CPU usage</span>
          <span className="min-w-[5ch] text-right text-lg font-mono tabular-nums text-foreground sm:text-left">
            {cpuPct}%
          </span>
        </div>
      </div>
    </div>
  )
}
