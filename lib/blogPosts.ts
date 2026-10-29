export interface ContentSection {
  type: "heading" | "paragraph" | "list" | "code" | "quote"
  text?: string
  items?: string[]
}

// Format YYYY-MM-DD for display (UTC calendar date).
export function formatBlogDate(isoDate: string): string {
  const parts = isoDate.split("-").map(Number)
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  if (!y || !m || !d) return isoDate
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function formatReadableDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  if (!y || !m || !d) return isoDate
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  content: ContentSection[]
  author: string
  // ISO 8601 date YYYY-MM-DD (schema.org, sitemap, Open Graph)
  datePublished: string
  dateModified?: string
  readingTime: string
  keywords?: string[]
  // Hero image for blog cards and featured layouts — use a unique asset per post
  coverImage?: string
  // Small badge label on the card
  dispatchTag?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-create-a-strong-password-in-2025",
    title: "How to Create a Strong Password in 2025: Complete Guide",
    description:
      "Practical techniques for creating strong passwords in 2025: length, complexity, and practices aligned with current guidance.",
    content: [
      {
        type: "paragraph",
        text: "Creating a strong password in 2025 requires understanding the evolving landscape of cybersecurity threats. With cyberattacks becoming increasingly sophisticated, the passwords we create need to be more robust than ever before.",
      },
      {
        type: "heading",
        text: "Why Password Strength Matters More Than Ever",
      },
      {
        type: "paragraph",
        text: "In recent years, we have witnessed a dramatic increase in data breaches and credential stuffing attacks. Hackers now use AI-powered password cracking tools that can attempt billions of combinations per second.",
      },
      {
        type: "paragraph",
        text: "The consequences of a compromised password extend far beyond a single account. Many people reuse passwords across services, meaning one breach can cascade into access to email, banking, and other critical accounts.",
      },
      {
        type: "heading",
        text: "The Anatomy of a Strong Password",
      },
      {
        type: "paragraph",
        text: "A truly strong password should incorporate several key elements. First and foremost is length — many guidelines suggest at least 16 characters for general use, though longer is often better.",
      },
      {
        type: "list",
        items: [
          "Length: At least 16 characters, preferably 20+",
          "Diversity: Mix of uppercase, lowercase, numbers, and symbols",
          "Randomness: No dictionary words, patterns, or personal information",
          "Uniqueness: Different password for every account",
        ],
      },
      {
        type: "heading",
        text: "Passphrases: A Modern Approach",
      },
      {
        type: "paragraph",
        text: "Passphrases consist of multiple random words from a large word list, often with separators or extra characters. Avoid famous examples or quotes—pick words randomly (for example using the EFF long wordlist) so the phrase is not predictable.",
      },
      {
        type: "paragraph",
        text: "The EFF maintains a curated wordlist for creating secure passphrases. Aim for at least four to six words and add numbers or symbols between words for extra security.",
      },
      {
        type: "heading",
        text: "Testing Your Password Strength",
      },
      {
        type: "paragraph",
        text: "Use reputable password strength checkers to evaluate security. Pay attention to the entropy score — a password with 60+ bits is considered strong, while 80+ bits provides excellent protection.",
      },
    ],
    author: "Passlore Team",
    datePublished: "2025-01-15",
    dateModified: "2025-01-20",
    readingTime: "8 min read",
    keywords: ["strong password", "how to create password", "password security 2025"],
    dispatchTag: "Industry report",
    coverImage: "/images/covers/strong-password.png",
  },
  {
    slug: "what-is-password-entropy-explained",
    title: "Password Entropy Explained: Why Bits Matter for Security",
    description:
      "Understand password entropy and why it is the true measure of password strength. Learn how bits of entropy translate to real-world security.",
    content: [
      {
        type: "paragraph",
        text: "Password entropy is the scientific measure of password unpredictability. While strength meters often show simplistic ratings, entropy provides a precise mathematical assessment of crack difficulty.",
      },
      {
        type: "heading",
        text: "What Exactly Is Entropy?",
      },
      {
        type: "paragraph",
        text: "In information theory, entropy measures uncertainty or randomness. When applied to passwords, it quantifies how many guesses an attacker would need to crack your password through brute force.",
      },
      {
        type: "paragraph",
        text: "Entropy is measured in bits, where each bit represents a doubling of possible combinations under a uniform model. A password with 40 bits of entropy has on the order of one trillion equally likely values (2^40).",
      },
      {
        type: "heading",
        text: "Calculating Password Entropy",
      },
      {
        type: "paragraph",
        text: "The formula is: entropy = length × log₂(character set size). For a password using all character types (about 95 characters), each character contributes approximately 6.5 bits of entropy.",
      },
      {
        type: "list",
        items: [
          "Lowercase only (26 chars): ~4.7 bits per character",
          "Mixed case (52 chars): ~5.7 bits per character",
          "With numbers (62 chars): ~6.0 bits per character",
          "All character types (95 chars): ~6.5 bits per character",
        ],
      },
      {
        type: "heading",
        text: "Entropy Thresholds",
      },
      {
        type: "list",
        items: [
          "Below 28 bits: Crackable almost instantly",
          "28-35 bits: Vulnerable to determined attackers",
          "36-59 bits: Reasonable for low-risk accounts",
          "60-80 bits: Strong protection for most purposes",
          "128+ bits: Suitable for high-security applications",
        ],
      },
      {
        type: "heading",
        text: "Random Generation Is Key",
      },
      {
        type: "paragraph",
        text: "The only way to ensure maximum entropy is through truly random password generation. Human-chosen passwords contain psychological patterns that reduce entropy significantly.",
      },
    ],
    author: "Passlore Team",
    datePublished: "2025-01-10",
    dateModified: "2025-01-18",
    readingTime: "9 min read",
    keywords: ["password entropy", "entropy bits", "password strength"],
    dispatchTag: "Tutorial",
    coverImage: "/images/covers/entropy.png",
  },
  {
    slug: "passphrase-vs-password-which-is-more-secure",
    title: "Passphrase vs Password: Which Is More Secure?",
    description:
      "Compare passphrases and traditional passwords to determine which offers better security. Learn when to use each approach.",
    content: [
      {
        type: "paragraph",
        text: "The debate between passphrases and traditional passwords continues as standards bodies and practitioners refine recommendations. Both approaches have merits — understanding the nuances helps you make the best choice.",
      },
      {
        type: "heading",
        text: "Defining the Terms",
      },
      {
        type: "paragraph",
        text: "A traditional password is typically 8-16 characters combining letters, numbers, and symbols. A passphrase uses multiple random words, often 4-8 words, sometimes with symbols between them.",
      },
      {
        type: "heading",
        text: "The Mathematics of Security",
      },
      {
        type: "paragraph",
        text: "Both can achieve equivalent security. A random 12-character password has about 78 bits of entropy. A six-word passphrase using the EFF wordlist reaches 77 bits — nearly identical security through different means.",
      },
      {
        type: "heading",
        text: "The Memorability Advantage",
      },
      {
        type: "paragraph",
        text: "Passphrases excel at memorability. The human brain remembers word sequences well. 'ember-harbor-steel-raven' is far easier to recall than 'xK9#mN2$pL' despite similar entropy.",
      },
      {
        type: "paragraph",
        text: "This has real security implications — users who can't remember complex passwords often reuse them or choose weaker alternatives.",
      },
      {
        type: "heading",
        text: "When to Use Each",
      },
      {
        type: "list",
        items: [
          "Passphrases: Password manager master passwords, full-disk encryption, memorable high-security credentials",
          "Passwords: Length-limited systems, high-frequency authentication, autofill scenarios",
          "Hybrid: Combine both approaches for exceptional security with memorability",
        ],
      },
      {
        type: "quote",
        text: "A memorable passphrase that users actually use consistently provides better real-world security than a complex password that gets compromised through poor practices.",
      },
    ],
    author: "Passlore Team",
    datePublished: "2025-01-05",
    dateModified: "2025-01-12",
    readingTime: "10 min read",
    keywords: ["passphrase vs password", "passphrase security", "EFF wordlist"],
    dispatchTag: "Opinion",
    coverImage: "/images/covers/passphrase.png",
  },
  {
    slug: "password-manager-vs-generator-comparison",
    title: "Password Manager vs Generator: What's the Difference?",
    description:
      "Understand the differences between password managers and generators. Learn how these tools complement each other for comprehensive security.",
    content: [
      {
        type: "paragraph",
        text: "Password managers and password generators are both essential security tools, but they serve fundamentally different purposes. Understanding the distinction helps you use both effectively.",
      },
      {
        type: "heading",
        text: "What Is a Password Generator?",
      },
      {
        type: "paragraph",
        text: "A password generator creates random passwords using cryptographically secure randomness. It produces passwords on-demand but does not store them — that responsibility falls to you or a separate tool.",
      },
      {
        type: "heading",
        text: "What Is a Password Manager?",
      },
      {
        type: "paragraph",
        text: "A password manager stores, organizes, and retrieves your passwords securely. Most include a built-in generator, but their primary function is secure credential storage with features like autofill and sync.",
      },
      {
        type: "heading",
        text: "How They Work Together",
      },
      {
        type: "list",
        items: [
          "Use a generator for maximum randomness and customization",
          "Store generated passwords in a password manager",
          "Let the manager handle autofill for convenience",
          "Use breach monitoring to know when passwords need changing",
        ],
      },
      {
        type: "heading",
        text: "When to Use a Standalone Generator",
      },
      {
        type: "paragraph",
        text: "Standalone generators like Passlore are useful when you need passwords for offline use, when you want to verify a manager's generator quality, or when you need specific customization options.",
      },
    ],
    author: "Passlore Team",
    datePublished: "2024-12-28",
    readingTime: "7 min read",
    keywords: ["password manager", "password generator", "password tools"],
    dispatchTag: "Deep dive",
    coverImage: "/images/covers/manager-generator.png",
  },
  {
    slug: "nist-password-guidelines-2025",
    title: "NIST Password Guidelines 2025: What Changed?",
    description:
      "Review the latest NIST password guidelines and what they mean for your security practices. Modern recommendations may surprise you.",
    content: [
      {
        type: "paragraph",
        text: "The National Institute of Standards and Technology (NIST) has significantly updated password guidelines in recent years, abandoning many long-held practices in favor of evidence-based recommendations.",
      },
      {
        type: "heading",
        text: "Key Changes from NIST",
      },
      {
        type: "list",
        items: [
          "Drop periodic password changes — only change when compromised",
          "Allow long passwords (64+ characters) and passphrases",
          "Remove arbitrary complexity requirements",
          "Check passwords against known breached password lists",
          "Emphasize multi-factor authentication over password complexity",
        ],
      },
      {
        type: "heading",
        text: "Why Forced Password Changes Hurt Security",
      },
      {
        type: "paragraph",
        text: "Research shows that mandatory password rotation leads to predictable patterns. Users increment numbers, change single characters, or use variations. Attackers know these patterns.",
      },
      {
        type: "heading",
        text: "Length Over Complexity",
      },
      {
        type: "paragraph",
        text: "NIST now emphasizes length over arbitrary complexity rules. A 20-character lowercase password is stronger than an 8-character password with mixed character types.",
      },
      {
        type: "heading",
        text: "Breach List Checking",
      },
      {
        type: "paragraph",
        text: "Organizations should check new passwords against databases of known compromised passwords. If a password appears in a breach, it should be rejected regardless of its apparent complexity.",
      },
      {
        type: "quote",
        text: "The NIST guidelines represent a shift from security theater to evidence-based practices that actually improve security outcomes.",
      },
    ],
    author: "Passlore Team",
    datePublished: "2024-12-20",
    readingTime: "6 min read",
    keywords: ["NIST password guidelines", "password policy", "security standards"],
    dispatchTag: "Standards",
    coverImage: "/images/covers/nist.png",
  },
]
