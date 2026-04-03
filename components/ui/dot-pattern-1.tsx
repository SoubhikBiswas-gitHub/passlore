"use client"

import { useId, type SVGProps } from "react"

import { cn } from "@/lib/utils"

export interface IDotPatternProps extends Omit<SVGProps<SVGSVGElement>, "children" | "width" | "height"> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  ...props
}: IDotPatternProps) {
  const id = useId()
  const patternId = `dot-pattern-${id.replace(/:/g, "")}`

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-primary/20 dark:fill-primary/30 md:fill-primary/25 md:dark:fill-primary/35",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
    </svg>
  )
}

export default DotPattern
