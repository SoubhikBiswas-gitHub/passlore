"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { estimateCrackTime, getCrackTimeColor } from "@/lib/crackTime"
import { cn } from "@/lib/utils"
import { Hourglass, Info, Lightning } from "@phosphor-icons/react"

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

/**
 * Maps discrete strength (from entropy tiers) to filled segments.
 * Aligns with headline + entropy/crack copy: a "very strong" password fills the bar.
 */
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
  "border border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/90 dark:text-red-200",
  "border border-red-200 bg-red-50/90 text-red-900 dark:border-red-900 dark:bg-red-950/80 dark:text-red-200",
  "border border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-100",
  "border border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/90 dark:text-green-200",
  "border border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/90 dark:text-green-200",
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
      <div
        className="w-full border border-border bg-card/80 p-3.5 sm:p-4"
        role="region"
        aria-label="Security score"
      >
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-[0.625rem] font-mono text-muted-foreground uppercase tracking-[0.18em]">
            <Lightning size={14} weight="fill" className="shrink-0 text-primary" aria-hidden />
            Security score
          </div>
          <p
            className={cn(
              "wrap-anywhere text-right text-[0.625rem] font-headline font-bold leading-snug shrink-0 max-w-[min(100%,12rem)] sm:max-w-none",
              headlineClass
            )}
          >
            {dashboardHeadline(strength)}
          </p>
        </div>
        <div className="w-full min-w-0">
          <div
            className="flex h-4 w-full gap-0.5 sm:h-5"
            role="img"
            title="Bar fill reflects estimated strength from entropy, not password length alone."
            aria-label={`${strengthLabels[strength]}, ${filled} of ${BLOCK_COUNT} segments filled`}
          >
            {STRENGTH_SEGMENT_KEYS.map((segmentKey, blockIndex) => (
              <div
                key={segmentKey}
                className={cn(
                  "min-h-0 min-w-0 basis-0 grow self-stretch",
                  blockIndex < filled ? activeColor : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between gap-3 font-mono text-[0.625rem] uppercase leading-snug">
          <div className="min-w-0 shrink text-left text-muted-foreground">Entropy · {bits} bits</div>
          <div className={cn("wrap-anywhere text-right shrink-0", crackTimeTextColor)} title={crackTime}>
            Crack · {crackTime}
          </div>
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
