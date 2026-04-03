import type { Metadata } from "next"

const SITE_URL = "https://securepass.pro"
const SITE_NAME = "SecurePass Pro"

export const defaultMetadata: Metadata = {
  title: "Free Strong Password Generator — SecurePass Pro",
  description:
    "Generate cryptographically secure passwords instantly. No signup. No data stored. HIBP breach check. Entropy meter. Trusted by 2M+ users. 100% free.",
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
    description:
      "Generate cryptographically secure passwords instantly. No signup. No data stored. HIBP breach check. Entropy meter. Trusted by 2M+ users. 100% free.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Strong Password Generator — SecurePass Pro",
    description:
      "Generate cryptographically secure passwords instantly. No signup. No data stored. HIBP breach check. Entropy meter. Trusted by 2M+ users. 100% free.",
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const aboutMetadata: Metadata = {
  title: "About SecurePass Pro — Password Security Experts",
  description:
    "Learn about SecurePass Pro's mission to make password security accessible to everyone. Our free tools help millions create stronger, safer passwords.",
  openGraph: {
    title: "About SecurePass Pro — Password Security Experts",
    description:
      "Learn about SecurePass Pro's mission to make password security accessible to everyone.",
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
    "SecurePass Pro privacy policy. Your passwords never leave your browser. We respect your privacy and collect minimal data.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy — SecurePass Pro",
    description:
      "How SecurePass Pro handles your data: client-side generation, k-anonymity breach checks, and minimal analytics.",
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
    "Expert articles on password security, best practices, and the latest security guidelines. Stay informed and protect your digital life.",
  openGraph: {
    title: "Password Security Blog — SecurePass Pro",
    description:
      "Expert articles on password security, best practices, and the latest security guidelines.",
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
  description:
    "Generate cryptographically secure passwords instantly. No signup. No data stored. HIBP breach check. Entropy meter. Trusted by 2M+ users. 100% free.",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "2847",
  },
}

// FAQ Schema defined inline to avoid module resolution issues
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes a strong password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A strong password has high entropy, meaning it's difficult to guess or crack. Key factors include: length (longer is better, at least 16 characters), character variety (uppercase, lowercase, numbers, symbols), and true randomness (not based on words or patterns). We recommend passwords with at least 80 bits of entropy for important accounts.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a password be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most accounts, we recommend at least 16 characters. For high-security accounts like your email or password manager, use 20+ characters. The longer your password, the exponentially harder it is to crack.",
      },
    },
    {
      "@type": "Question",
      name: "Is this password generator safe to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, absolutely. Our password generator uses cryptographically secure random number generation (crypto.getRandomValues) built into your browser. Your passwords are generated entirely on your device and never sent to our servers.",
      },
    },
    {
      "@type": "Question",
      name: "What is password entropy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entropy measures the randomness or unpredictability of a password, expressed in bits. Each bit doubles the number of possible combinations. A password with 80 bits of entropy has 2^80 possible combinations, making it extremely difficult to crack.",
      },
    },
    {
      "@type": "Question",
      name: "Passphrase vs password — which is more secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both can be equally secure depending on length. Passphrases combine multiple random words, making them easier to remember while maintaining high security. A 4-6 word passphrase can have 50-80+ bits of entropy.",
      },
    },
    {
      "@type": "Question",
      name: "How often should I change my password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Current security guidance (including NIST) recommends against routine password changes. Only change passwords when there's evidence of a breach, you've shared it with someone, or you see suspicious account activity.",
      },
    },
    {
      "@type": "Question",
      name: "What does 'Have I Been Pwned' check mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Have I Been Pwned (HIBP) is a service that tracks passwords exposed in data breaches. Our check uses k-anonymity: only the first 5 characters of your password's SHA-1 hash are sent to HIBP. Your actual password never leaves your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use a password manager?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Password managers let you use unique, strong passwords for every account without memorizing them. They encrypt your vault with a master password and can auto-fill credentials.",
      },
    },
  ],
}

export const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [webApplicationSchema, faqSchema],
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
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
