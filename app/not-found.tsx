import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center max-w-3xl mx-auto">
      <div className="p-6 bg-accent-2/50 rounded-none mb-6 border border-border">
        <ShieldCheck className="h-12 w-12 text-primary" weight="fill" />
      </div>
      <h1 className="text-4xl font-headline font-bold text-primary mb-2 tracking-tight">404</h1>
      <h2 className="text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground mb-6">
        Page not found
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to generating secure passwords.
      </p>
      <Button asChild>
        <Link href="/">Go to password generator</Link>
      </Button>
    </div>
  )
}
