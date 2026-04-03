"use client"

import { useState, useCallback } from "react"
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
  const [inputValue, setInputValue] = useState(String(length))

  const schema = z.number().int().min(min).max(max)

  const handleInputBlur = useCallback(() => {
    const parsed = parseInt(inputValue, 10)
    const result = schema.safeParse(parsed)
    if (result.success) {
      onLengthChange(result.data)
    } else {
      setInputValue(String(length))
    }
  }, [inputValue, length, onLengthChange, schema])

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const val = values[0]
      onLengthChange(val)
      setInputValue(String(val))
    },
    [onLengthChange]
  )

  if (variant === "dashboard") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-0">
          <label className="text-[0.6875rem] uppercase tracking-widest text-zinc-500 font-bold">{label}</label>
          <span className="font-mono text-blue-400 font-bold text-lg">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={1}
          className="w-full [&_[role=slider]]:bg-blue-500"
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={length}
        />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</label>
        <Badge variant="secondary" className="text-xs">
          {length} {unit}
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          value={[length]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={1}
          className="flex-1"
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={length}
        />
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          className="w-16 px-2 py-1 text-sm text-center border border-zinc-200 dark:border-zinc-800 rounded-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
        />
      </div>
    </div>
  )
}
