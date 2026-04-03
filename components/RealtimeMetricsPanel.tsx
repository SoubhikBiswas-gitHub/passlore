interface RealtimeMetricsPanelProps {
  sessionCount: number
}

export function RealtimeMetricsPanel({ sessionCount }: RealtimeMetricsPanelProps) {
  const salts = Math.min(1024, 64 + sessionCount * 37)
  const cpuPct = (22 + (sessionCount % 5) * 0.35 + (sessionCount % 3) * 0.12).toFixed(1)

  return (
    <div className="bg-zinc-950 p-6 border-t border-zinc-900">
      <h3 className="text-[0.6875rem] uppercase tracking-widest font-bold text-zinc-500 mb-6">
        Real-time metrics
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-black/20 p-3 border border-zinc-900/50">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Session ID</span>
          <span className="text-xl font-mono text-blue-400">{sessionCount}</span>
        </div>
        <div className="flex justify-between items-center bg-black/20 p-3 border border-zinc-900/50">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Unique salt</span>
          <span className="text-xl font-mono text-blue-400">{salts.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center bg-black/20 p-3 border border-zinc-900/50">
          <span className="text-[10px] uppercase font-mono text-zinc-400">CPU usage</span>
          <span className="text-xl font-mono text-emerald-400">{cpuPct}%</span>
        </div>
      </div>
    </div>
  )
}
