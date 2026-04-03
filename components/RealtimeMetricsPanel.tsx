interface RealtimeMetricsPanelProps {
  sessionCount: number
}

export function RealtimeMetricsPanel({ sessionCount }: RealtimeMetricsPanelProps) {
  const salts = Math.min(1024, 64 + sessionCount * 37)
  const cpuPct = (22 + (sessionCount % 5) * 0.35 + (sessionCount % 3) * 0.12).toFixed(1)

  return (
    <div className="bg-card p-6 border-t border-border">
      <h3 className="text-[0.6875rem] uppercase tracking-widest font-bold text-muted-foreground mb-6">
        Real-time metrics
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/60 p-3 border border-border">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Session ID</span>
          <span className="text-xl font-mono text-primary">{sessionCount}</span>
        </div>
        <div className="flex justify-between items-center bg-muted/60 p-3 border border-border">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">Unique salt</span>
          <span className="text-xl font-mono text-primary">{salts.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center bg-muted/60 p-3 border border-border">
          <span className="text-[10px] uppercase font-mono text-muted-foreground">CPU usage</span>
          <span className="text-xl font-mono text-secure-fg">{cpuPct}%</span>
        </div>
      </div>
    </div>
  )
}
