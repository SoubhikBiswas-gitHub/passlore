interface HomeAdPlaceholderProps {
  format: "leaderboard" | "rectangle"
}

export function HomeAdPlaceholder({ format }: HomeAdPlaceholderProps) {
  const isLeader = format === "leaderboard"
  return (
    <div
      className={
        isLeader
          ? "w-full h-24 bg-zinc-900/40 border border-zinc-800/50 flex items-center justify-center mb-16 overflow-hidden relative"
          : "w-full max-w-2xl mx-auto h-[250px] bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center my-24 overflow-hidden relative"
      }
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-700 absolute top-2 left-3">
        Advertisement
      </span>
      <div className="text-zinc-600 font-mono text-sm tracking-widest opacity-40 text-center px-4">
        {isLeader ? (
          "SECURE_TUNNEL_PRO_AD_728x90"
        ) : (
          <>
            VPN_ULTIMATE_SECURE_300x250
            <span className="text-[10px] opacity-50 uppercase tracking-widest mt-2 block">
              High-visibility inventory
            </span>
          </>
        )}
      </div>
    </div>
  )
}
