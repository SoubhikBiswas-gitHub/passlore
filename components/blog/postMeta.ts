export const CATEGORIES = ["All", "Basics", "Explainers", "Comparisons", "Standards"] as const
export type Category = Exclude<(typeof CATEGORIES)[number], "All">

export type HeroTicket = { tag: string; value: string; note: string }

export type PostMeta = {
  category: Category
  recipe: string
  recipeHref: string
  tryTitle: string
  tryLine: string
  tryCta: string
  motif: string
  tickets: HeroTicket[]
  featured?: boolean
  compareBefore?: string
}

const FALLBACK: PostMeta = {
  category: "Basics",
  recipe: "Just one",
  recipeHref: "/#r=quick",
  tryTitle: "Try it: a strong password in one tap",
  tryLine: "Opens the generator on Just one.",
  tryCta: "Cut a password",
  motif: "M28 44h40v14H28z M28 66h88v14H28z M28 88h150v14H28z M28 110h230v14H28z",
  tickets: [{ tag: "Just one", value: "m4X!rQ9#tLp2&vZ8", note: "16 characters · from all 89" }],
}

const META: Record<string, PostMeta> = {
  "how-to-create-a-strong-password-in-2025": FALLBACK,
  "what-is-password-entropy-explained": {
    category: "Explainers",
    recipe: "Build your own",
    recipeHref: "/#r=custom",
    tryTitle: "Try it: watch the bits change",
    tryLine: "Opens the generator on Build your own → Characters.",
    tryCta: "Build a password",
    motif:
      "M40 30h22v22H40z M72 30h22v22H72z M104 30h22v22h-22z M136 30h22v22h-22z M40 62h22v22H40z M72 62h22v22H72z M104 62h22v22h-22z M40 94h22v22H40z M72 94h22v22H72z M40 126h22v22H40z",
    tickets: [
      { tag: "Characters", value: "k9$Lw2#Qx7!pR4@z", note: "16 × log₂ 89 ≈ 103.6 bits" },
      { tag: "PIN", value: "740 318", note: "6 × log₂ 10 ≈ 19.9 bits" },
    ],
  },
  "passphrase-vs-password-which-is-more-secure": {
    category: "Comparisons",
    recipe: "Build your own",
    recipeHref: "/#r=custom",
    tryTitle: "Try it: a 6-word passphrase",
    tryLine: "Opens the generator on Build your own → Words.",
    tryCta: "Make a passphrase",
    motif: "M184 40h100v84H184z M206 70h56v24h-56z M60 40h40v90H60z M100 40a30 30 0 0 1 0 60z",
    tickets: [
      { tag: "Words", value: "orbit lamp cedar velvet quarry pilot", note: "6 words · you type it" },
      { tag: "Password manager", value: "qT7#vL2m!Rw9xK4p", note: "16 characters · it types it" },
    ],
    featured: true,
    compareBefore: "When a passphrase wins",
  },
  "password-manager-vs-generator-comparison": {
    category: "Comparisons",
    recipe: "Password manager",
    recipeHref: "/#r=manager",
    tryTitle: "Try it: a password for your manager",
    tryLine: "Opens the generator on Password manager: 32 characters you’ll never type.",
    tryCta: "Cut a long one",
    motif: "M184 40h100v84H184z M206 70h56v24h-56z M60 40h40v90H60z M100 40a30 30 0 0 1 0 60z",
    tickets: [
      { tag: "Password manager", value: "Vq8!nR2#xLm7@Tp4Kz9&wS3$hJ6*cB1e", note: "32 characters · it types it" },
    ],
  },
  "nist-password-guidelines-2025": {
    category: "Standards",
    recipe: "Site rules",
    recipeHref: "/#r=custom",
    tryTitle: "Try it: fit a site’s rules",
    tryLine: "Opens the generator on Build your own → Fit site rules.",
    tryCta: "Fit the rules",
    motif: "M30 54h260v14H30z M30 78h200v14H30z M30 102h230v14H30z M250 20l30 30-30 30-30-30z",
    tickets: [{ tag: "Site rules", value: "Wd4kTq9vNz2hRb7x", note: "The longest the rules allow" }],
  },
}

export function postMeta(slug: string): PostMeta {
  return META[slug] ?? FALLBACK
}
