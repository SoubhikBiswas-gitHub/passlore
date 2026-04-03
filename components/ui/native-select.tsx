"use client"

import * as React from "react"
import { CaretDown } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/** Shared styles for native `<select>` — neutral border, ring on focus, room for custom chevron. */
function nativeSelectClassName(className?: string) {
  return cn(
    "w-full min-h-11 cursor-pointer appearance-none rounded-none border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground",
    "transition-[border-color,box-shadow,background-color]",
    "hover:border-foreground/20",
    "focus:outline-none focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring/35",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&>option]:bg-popover [&>option]:text-popover-foreground",
    className
  )
}

export function NativeSelect({
  className,
  wrapperClassName,
  children,
  ...props
}: React.ComponentProps<"select"> & { wrapperClassName?: string }) {
  return (
    <div className={cn("relative", wrapperClassName ?? "w-full")}>
      <select className={nativeSelectClassName(className)} {...props}>
        {children}
      </select>
      <CaretDown
        className="pointer-events-none absolute right-2.5 top-1/2 z-[1] size-4 -translate-y-1/2 text-muted-foreground"
        weight="bold"
        aria-hidden
      />
    </div>
  )
}
