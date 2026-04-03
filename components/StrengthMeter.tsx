"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lightning, Hourglass, Info } from "@phosphor-icons/react"
import { estimateCrackTime, getCrackTimeColor } from "@/lib/crackTime"
import { cn } from "@/lib/utils"

interface StrengthMeterProps {
  bits: number
  strength: number
  variant?: "default" | "dashboard"
}

const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"]

const BLOCK_COUNT = 12

const STRENGTH_SEGMENT_KEYS = [
  "seg-a",
  "seg-b",
  "seg-c",
  "seg-d",
  "seg-e",
  "seg-f",
  "seg-g",
  "seg-h",
  "seg-i",
  "seg-j",
  "seg-k",
  "seg-l",
] as const

function blocksFilledForStrength(strength: number): number {
  const map = [0, 2, 4, 6, 9, 12]
  return map[strength] ?? 0
}

function blockColorClass(strength: number): string {
  if (strength <= 2) return "bg-red-400 dark:bg-red-400"
  if (strength === 3) return "bg-amber-400 dark:bg-amber-400"
  return "bg-green-400 dark:bg-green-400"
}

const strengthBadgeColors = [
  "",
  "bg-red-950/40 text-red-600 dark:text-red-400 border-red-800/50",
  "bg-red-950/30 text-red-600 dark:text-red-400 border-red-800/40",
  "bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-800/50",
  "bg-green-950/40 text-green-600 dark:text-green-400 border-green-800/50",
  "bg-green-950/40 text-green-600 dark:text-green-400 border-green-800/50",
]

function dashboardHeadline(strength: number): string {
  if (strength >= 4) return "CRYPTOGRAPHICALLY STRONG"
  if (strength === 3) return "ACCEPTABLE"
  if (strength === 2) return "WEAK"
  return "VERY WEAK"
}

export function StrengthMeter({ bits, strength, variant = "default" }: StrengthMeterProps) {
  const crackTime = estimateCrackTime(bits)
  const crackColor = getCrackTimeColor(bits)
  const filled = blocksFilledForStrength(strength)
  const activeColor = blockColorClass(strength)

  const crackTimeTextColor = {
    red: "text-red-600 dark:text-red-400",
    amber: "text-amber-600 dark:text-amber-400",
    green: "text-green-600 dark:text-green-400",
  }[crackColor]

  if (variant === "dashboard") {
    const headlineClass =
      strength >= 4 ? "text-green-400" : strength === 3 ? "text-amber-400" : "text-red-400"

    return (
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3 gap-4">
          <span className="text-[0.6875rem] font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Security score
          </span>
          <span className={cn("text-sm font-headline font-bold text-right", headlineClass)}>
            {dashboardHeadline(strength)}
          </span>
        </div>
        <div
          className="flex gap-1 h-16 w-full"
          role="img"
          aria-label={`Strength ${strengthLabels[strength]}, ${filled} of ${BLOCK_COUNT} vertical blocks`}
        >
          {STRENGTH_SEGMENT_KEYS.map((segmentKey, blockIndex) => (
            <div
              key={segmentKey}
              className={cn(
                "flex-1 min-w-0 min-h-0 self-stretch",
                blockIndex < filled ? activeColor : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs font-mono text-muted-foreground">
          <span>ENTROPY: {bits} bits</span>
          <span className={crackTimeTextColor}>CRACK TIME: {crackTime}</span>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Password strength</span>
            <Badge className={cn("text-[0.6875rem] uppercase tracking-[0.05em] rounded-none", strengthBadgeColors[strength])}>
              {strengthLabels[strength]}
            </Badge>
          </div>
        </div>

        <div
          className="flex gap-1"
          role="img"
          aria-label={`Strength ${strengthLabels[strength]}, ${filled} of ${BLOCK_COUNT} blocks`}
        >
          {STRENGTH_SEGMENT_KEYS.map((segmentKey, blockIndex) => (
            <div
              key={segmentKey}
              className={cn(
                "h-2 flex-1 min-w-0 rounded-none",
                blockIndex < filled ? activeColor : "bg-muted"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 cursor-help font-mono text-xs">
                  <Lightning size={14} weight="fill" className="text-primary" />
                  {bits} bits
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs rounded-none">
                <div className="flex items-start gap-1">
                  <Info size={14} weight="regular" className="mt-0.5 shrink-0" />
                  <span>
                    {"Entropy = log\u2082(charset size) \u00D7 length. Higher bits = exponentially harder to crack."}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className={cn("flex items-center gap-1 text-xs", crackTimeTextColor)}>
            <Hourglass size={14} weight="regular" />
            {crackTime}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
