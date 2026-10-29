import Link from "next/link"
import { DotsNine, Lightning, SlidersHorizontal, Vault, WifiHigh } from "@phosphor-icons/react/dist/ssr"

export const RECIPES = [
  { id: "quick", name: "Just one", line: "Strong, random, ready now", Icon: Lightning },
  { id: "manager", name: "Password manager", line: "You’ll never type it", Icon: Vault },
  { id: "wifi", name: "Wi-Fi", line: "Read it out, or scan a QR", Icon: WifiHigh },
  { id: "pin", name: "PIN", line: "Phone, card, door", Icon: DotsNine },
  { id: "custom", name: "Build your own", line: "Words, site rules, many", Icon: SlidersHorizontal },
] as const

export function recipeHref(id: string) {
  return `/#r=${id}`
}

export function RecipeDeck({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Recipes" className={`grid w-full grid-cols-2 gap-2 md:grid-cols-5 md:gap-3 ${className}`}>
      {RECIPES.map(({ id, name, line, Icon }) => (
        <Link
          key={id}
          href={recipeHref(id)}
          className="relative flex min-h-[88px] flex-col items-start gap-2 rounded-2xl border-[1.5px] border-line bg-surface px-3 pb-3 pt-3.5 text-left text-ink no-underline shadow-e1 transition-[transform,border-color] duration-200 ease-calm hover:-translate-y-[3px] hover:border-primary motion-reduce:hover:translate-y-0 md:min-h-[124px]"
        >
          <Icon className="size-8 text-primary" weight="duotone" aria-hidden />
          <span className="font-display text-base font-bold leading-[1.1] tracking-[-0.01em]">{name}</span>
          <span className="hidden text-[13px] leading-[1.3] text-ink-2 md:block">{line}</span>
        </Link>
      ))}
    </nav>
  )
}
