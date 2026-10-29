import { cn } from "@/lib/utils"

export const wrap = "mx-auto w-full max-w-[1240px] px-4 md:px-8"

const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent font-semibold no-underline transition-[background-color,transform,color] duration-150 ease-calm active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"

const size = { md: "min-h-11 px-[18px] text-[15px]", sm: "min-h-11 px-3 text-sm", lg: "min-h-14 rounded-md px-6 text-[17px]" }
const tone = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border-line-strong bg-surface text-ink hover:bg-surface-2",
  done: "bg-success text-bg",
}

export const btn = {
  primary: cn(btnBase, size.md, tone.primary),
  secondary: cn(btnBase, size.md, tone.secondary),
  primaryLg: cn(btnBase, size.lg, tone.primary),
  secondarySm: cn(btnBase, size.sm, tone.secondary),
  copied: cn(btnBase, size.lg, tone.done),
}

export const stageBtn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-ink-2 bg-transparent px-3.5 text-sm font-semibold text-ink no-underline transition-colors duration-150 ease-calm hover:bg-surface-2"

export const pill =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink-2 bg-transparent px-4 text-sm font-semibold text-ink no-underline transition-colors duration-150 ease-calm hover:bg-surface-2 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-bg"

export const card = "rounded-lg border border-line bg-surface shadow-e1"

export const eyebrow = "m-0 text-sm font-bold uppercase tracking-[0.08em] text-link"

export const meta = "text-[13px] text-ink-3"

export const h1Hero =
  "m-0 font-display text-[40px] font-extrabold leading-[1] tracking-[-0.045em] text-balance md:text-[68px]"

export const lede = "m-0 max-w-[640px] text-xl leading-[1.55] text-ink-2"

export const prose = [
  "min-w-0 text-[17px] leading-[1.65] text-ink md:text-lg",
  "[&_h2]:mb-3.5 [&_h2]:mt-12 [&_h2]:scroll-mt-6 [&_h2]:font-display [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:leading-[1.1] [&_h2]:tracking-[-0.025em] md:[&_h2]:mt-16 md:[&_h2]:text-[34px]",
  "[&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold",
  "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1.5",
  "[&_code]:font-mono [&_code]:text-[max(12px,0.92em)]",
  "[&_pre]:mb-5 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre [&_pre]:rounded-md [&_pre]:bg-bg [&_pre]:px-[18px] [&_pre]:py-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-[1.6] [&_pre]:text-ink",
  "[&_a]:text-link [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a:hover]:decoration-2",
].join(" ")

export const tinyTicket = "flex flex-col gap-2 rounded-2xl bg-surface px-[18px] py-4 text-ink shadow-ticket"

export const forTag =
  "inline-flex items-center gap-2 self-start rounded-full bg-primary-soft py-1 pl-2 pr-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-on-primary-soft"
