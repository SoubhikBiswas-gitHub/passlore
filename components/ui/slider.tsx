'use client'

import * as React from 'react'
import ReactSlider from 'react-slider'

import { cn } from '@/lib/utils'

export interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (values: number[]) => void
  onValueCommit?: (values: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  id?: string
  'aria-label'?: string
  /** Ignored — `react-slider` sets these on the thumb from `min` / `max` / value. */
  'aria-valuemin'?: number
  'aria-valuemax'?: number
  'aria-valuenow'?: number
}

function Slider({
  className,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  id,
  'aria-label': ariaLabel,
}: SliderProps) {
  const controlled = value !== undefined
  const numericValue = controlled ? (value[0] ?? min) : undefined
  const numericDefault =
    !controlled && defaultValue !== undefined && defaultValue.length > 0
      ? defaultValue[0]
      : undefined

  return (
    <ReactSlider
      className={cn(
        'ssp-slider relative flex h-11 w-full touch-none select-none items-center',
        'cursor-grab active:cursor-grabbing',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={controlled ? numericValue : undefined}
      defaultValue={numericDefault}
      ariaLabel={ariaLabel}
      onChange={(v) => onValueChange?.([v])}
      onAfterChange={(v) => onValueCommit?.([v])}
      thumbClassName="ssp-slider-thumb"
      trackClassName="ssp-slider-track"
      renderTrack={(props, state) => {
        const { key, ...trackProps } = props
        return (
          <div
            key={key}
            {...trackProps}
            className={cn(
              trackProps.className,
              'z-[1] h-2 overflow-hidden rounded-none',
              state.index === 0
                ? 'bg-primary shadow-[inset_0_0_0_1px_hsl(var(--primary-foreground)/0.22)]'
                : 'bg-transparent',
            )}
          />
        )
      }}
      renderThumb={(props) => {
        const { key, ...thumbProps } = props
        return (
          <div
            key={key}
            {...thumbProps}
            id={id}
            className={cn(
              thumbProps.className,
              'size-5 rounded-none border-2 border-primary-foreground/35 bg-primary',
              'shadow-[0_0_0_1px_hsl(var(--foreground)/0.12),0_1px_2px_hsl(var(--foreground)/0.08)]',
              'ring-ring/40 transition-[box-shadow,filter] motion-safe:duration-150 motion-safe:ease-out',
              'hover:brightness-110 focus-visible:ring-4 focus-visible:outline-none',
              'motion-reduce:transition-none motion-reduce:hover:brightness-100',
            )}
          />
        )
      }}
    />
  )
}

export { Slider }
