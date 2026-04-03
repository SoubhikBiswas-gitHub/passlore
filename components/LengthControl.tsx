"use client"

import { useState, useCallback, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"

interface LengthControlProps {
  length: number
  onLengthChange: (length: number) => void
  min?: number
  max?: number
  label?: string
  unit?: string
  variant?: "default" | "dashboard"
}

export function LengthControl({
  length,
  onLengthChange,
  min = 4,
  max = 256,
  label = "Length",
  unit = "chars",
  variant = "default",
}: LengthControlProps) {
  /** Drives the slider locally; parent updates on commit only so drag keeps pointer capture. */
  const [sliderLength, setSliderLength] = useState(length)
  const [inputValue, setInputValue] = useState(String(length))

  const schema = z.number().int().min(min).max(max)

  useEffect(() => {
    setSliderLength(length)
    setInputValue(String(length))
  }, [length])

  const handleInputBlur = useCallback(() => {
    const parsed = parseInt(inputValue, 10)
    const result = schema.safeParse(parsed)
    if (result.success) {
      onLengthChange(result.data)
    } else {
      setInputValue(String(length))
    }
  }, [inputValue, length, onLengthChange, schema])

  const handleSliderValueChange = useCallback((values: number[]) => {
    setSliderLength(values[0])
  }, [])

  const handleSliderValueCommit = useCallback(
    (values: number[]) => {
      const val = values[0]
      onLengthChange(val)
      setInputValue(String(val))
    },
    [onLengthChange]
  )

  if (variant === "dashboard") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-baseline gap-4">
          <label
            htmlFor={`length-slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-[0.6875rem] uppercase tracking-widest text-foreground/90 font-bold leading-relaxed pt-0.5"
          >
            {label}
          </label>
          <span
            className="font-mono text-foreground font-bold text-lg tabular-nums min-w-[2.5ch] text-right"
            aria-live="polite"
            aria-atomic="true"
          >
            {sliderLength}
          </span>
        </div>
        <div className="pt-1">
          <Slider
            id={`length-slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={[sliderLength]}
            onValueChange={handleSliderValueChange}
            onValueCommit={handleSliderValueCommit}
            min={min}
            max={max}
            step={1}
            className="w-full"
            aria-label={`${label} slider`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={sliderLength}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Badge variant="secondary" className="text-xs">
          {sliderLength} {unit}
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          value={[sliderLength]}
          onValueChange={handleSliderValueChange}
          onValueCommit={handleSliderValueCommit}
          min={min}
          max={max}
          step={1}
          className="flex-1"
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={sliderLength}
        />
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          className="w-16 px-2 py-1 text-sm text-center border border-border rounded-none bg-background text-foreground"
        />
      </div>
    </div>
  )
}
