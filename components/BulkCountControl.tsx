"use client"

import { useCallback, useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export const BULK_COUNT_MIN = 1
export const BULK_COUNT_MAX = 500

interface IBulkCountControlProps {
  count: number
  onCountChange: (count: number) => void
  variant?: "default" | "dashboard"
  /** When true with dashboard variant, only value + slider (section title lives outside). */
  embedded?: boolean
}

export function BulkCountControl({ count, onCountChange, variant = "default", embedded = false }: IBulkCountControlProps) {
  const [sliderCount, setSliderCount] = useState(count)
  const [inputValue, setInputValue] = useState(String(count))

  useEffect(() => {
    setSliderCount(count)
    setInputValue(String(count))
  }, [count])

  const handleInputBlur = useCallback(() => {
    const parsed = parseInt(inputValue, 10)
    if (!Number.isFinite(parsed)) {
      setInputValue(String(count))
      return
    }
    const clamped = Math.min(BULK_COUNT_MAX, Math.max(BULK_COUNT_MIN, Math.round(parsed)))
    onCountChange(clamped)
    setInputValue(String(clamped))
  }, [inputValue, count, onCountChange])

  const handleSliderValueChange = useCallback((values: number[]) => {
    setSliderCount(values[0])
  }, [])

  const handleSliderValueCommit = useCallback(
    (values: number[]) => {
      const val = values[0]
      onCountChange(val)
      setInputValue(String(val))
    },
    [onCountChange]
  )

  const sliderId = "bulk-count-slider"

  if (variant === "dashboard") {
    if (embedded) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <span
              className="shrink-0 font-mono text-lg font-bold tabular-nums text-primary"
              aria-live="polite"
              aria-atomic="true"
            >
              {sliderCount}
            </span>
          </div>
          <Slider
            value={[sliderCount]}
            onValueChange={handleSliderValueChange}
            onValueCommit={handleSliderValueCommit}
            min={BULK_COUNT_MIN}
            max={BULK_COUNT_MAX}
            step={1}
            className="w-full"
            aria-label={`Bulk count, ${sliderCount} of ${BULK_COUNT_MAX} passwords per batch`}
            aria-valuemin={BULK_COUNT_MIN}
            aria-valuemax={BULK_COUNT_MAX}
            aria-valuenow={sliderCount}
          />
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <label htmlFor={sliderId} className="block text-label-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bulk count
            </label>
            <p className="text-[11px] leading-snug text-muted-foreground">
              How many passwords to generate in one run (max {BULK_COUNT_MAX}).
            </p>
          </div>
          <span
            className="shrink-0 font-mono text-lg font-bold tabular-nums text-primary"
            aria-live="polite"
            aria-atomic="true"
          >
            {sliderCount}
          </span>
        </div>
        <div className="pt-0.5">
          <Slider
            id={sliderId}
            value={[sliderCount]}
            onValueChange={handleSliderValueChange}
            onValueCommit={handleSliderValueCommit}
            min={BULK_COUNT_MIN}
            max={BULK_COUNT_MAX}
            step={1}
            className="w-full"
            aria-label="Number of passwords to generate"
            aria-valuemin={BULK_COUNT_MIN}
            aria-valuemax={BULK_COUNT_MAX}
            aria-valuenow={sliderCount}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={sliderId} className="text-sm font-medium text-foreground">
          Passwords to generate
        </label>
        <Badge variant="secondary" className="font-mono text-xs tabular-nums">
          {sliderCount}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Between {BULK_COUNT_MIN} and {BULK_COUNT_MAX} per batch.
      </p>
      <div className="flex items-center gap-4">
        <Slider
          id={sliderId}
          value={[sliderCount]}
          onValueChange={handleSliderValueChange}
          onValueCommit={handleSliderValueCommit}
          min={BULK_COUNT_MIN}
          max={BULK_COUNT_MAX}
          step={1}
          className="flex-1"
          aria-label="Number of passwords to generate"
          aria-valuemin={BULK_COUNT_MIN}
          aria-valuemax={BULK_COUNT_MAX}
          aria-valuenow={sliderCount}
        />
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputBlur}
          min={BULK_COUNT_MIN}
          max={BULK_COUNT_MAX}
          className="w-20 border border-border bg-background px-2 py-1.5 text-center text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
        />
      </div>
    </div>
  )
}
