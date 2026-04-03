import type { Metadata } from "next"

const SITE_URL = "https://securepass.pro"
const SITE_NAME = "SecurePass Pro"

/** Defensible site summary for meta tags and JSON-LD (no user counts or ratings). */
export const SITE_DESCRIPTION =
  "Generate random passwords and passphrases in your browser using crypto.getRandomValues. No account required. Passwords are not sent to our servers. Optional Have I Been Pwned check uses k-anonymity (only a SHA-1 hash prefix leaves your browser). Free to use."

export const defaultMetadata: Metadata = {
  title: "Free Strong Password Generator — SecurePass Pro",
  description: SITE_DESCRIPTION,
  keywords: [
    "password generator",
    "strong password generator",
    "random password",
    "secure password",
    "free password generator",
    "password strength checker",
    "passphrase generator",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Free Strong Password Generator — SecurePass Pro",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Strong Password Generator — SecurePass Pro",
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const aboutMetadata: Metadata = {
  title: "About SecurePass Pro",
  description:
    "How SecurePass Pro works: client-side generation with the Web Crypto API, optional breach checks, and privacy-minded defaults.",
  openGraph: {
    title: "About SecurePass Pro",
    description:
      "Client-side password and passphrase generation, optional Have I Been Pwned k-anonymity checks, and how we handle data.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

export const privacyMetadata: Metadata = {
  title: "Privacy Policy — SecurePass Pro",
  description:
    "SecurePass Pro privacy policy. Passwords are generated in your browser. We collect minimal data and explain cookies, analytics, and third parties.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy — SecurePass Pro",
    description:
      "How SecurePass Pro handles your data: client-side generation, k-anonymity breach checks, cookies, and analytics.",
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
}

export const termsMetadata: Metadata = {
  title: "Terms of Service — SecurePass Pro",
  description:
    "Terms and conditions for using SecurePass Pro, the free client-side password generator and security tools.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service — SecurePass Pro",
    description: "Terms of service for SecurePass Pro — acceptable use, disclaimers, and liability.",
    url: `${SITE_URL}/terms`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
}

export const blogMetadata: Metadata = {
  title: "Password Security Blog — SecurePass Pro",
  description:
    "Articles on password security, passphrases, entropy, and practical guidance aligned with current standards.",
  openGraph: {
    title: "Password Security Blog — SecurePass Pro",
    description:
      "Articles on password security, passphrases, entropy, and practical guidance aligned with current standards.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SecurePass Pro",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "SecurePass Pro",
  },
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes a strong password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A strong password has high entropy: it is difficult to guess or crack. Key factors include length (often 16+ characters for general use), character variety when using random strings, and randomness (avoid predictable words and personal information). Higher entropy (for example 80+ bits) generally means a much larger search space for an attacker.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a password be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most accounts, at least 16 characters is a common recommendation; use more for high-value accounts (email, password manager). Longer secrets increase the search space; exact risk depends on how the secret is stored and attacked (online guessing vs offline hash cracking).",
      },
    },
    {
      "@type": "Question",
      name: "Is this password generator safe to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Passwords and passphrases are built in your browser using crypto.getRandomValues (a cryptographically strong source). They are not sent to SecurePass Pro servers for generation. Optional breach checks contact Have I Been Pwned using only a k-anonymity hash prefix, not your plaintext password.",
      },
    },
    {
      "@type": "Question",
      name: "What is password entropy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entropy measures unpredictability, often expressed in bits. Each extra bit doubles the number of equally likely possibilities under idealized assumptions. Real-world risk also depends on storage, hashing, and attacker capabilities—not bits alone.",
      },
    },
    {
      "@type": "Question",
      name: "Passphrase vs password — which is more secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Either can be strong if it is long and random enough. Passphrases built from randomly chosen words (for example from a large word list) can be memorable and high-entropy. Random character passwords are often used with a password manager. Avoid famous example phrases or quotes.",
      },
    },
    {
      "@type": "Question",
      name: "How often should I change my password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NIST SP 800-63B and similar guidance de-emphasize routine rotation without cause. Change a password when you know or suspect compromise, reuse on a breached service, or your provider requires it— not on a fixed calendar alone.",
      },
    },
    {
      "@type": "Question",
      name: "What does 'Have I Been Pwned' check mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Have I Been Pwned (HIBP) publishes known breached password hashes. This app hashes your password with SHA-1 locally, then sends only the first five hexadecimal characters of that hash to HIBP's range API (k-anonymity). The full hash suffix is matched locally. Your plaintext password is not sent. Requests use HIBP's recommended padding header to reduce observer inference.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use a password manager?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for most people a reputable password manager helps you use unique, strong secrets per site. This generator can create a secret in the browser; you then store it in your manager.",
      },
    },
  ],
}

function toIsoDateTime(calendarDate: string): string {
  if (calendarDate.includes("T")) return calendarDate
  return `${calendarDate}T12:00:00.000Z`
}

export function getBlogPostSchema(post: {
  title: string
  description: string
  slug: string
  author: string
  datePublished: string
  dateModified?: string
  keywords?: string[]
}) {
  const published = toIsoDateTime(post.datePublished)
  const modified = toIsoDateTime(post.dateModified ?? post.datePublished)
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: published,
    dateModified: modified,
    keywords: post.keywords?.join(", ") || "",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
