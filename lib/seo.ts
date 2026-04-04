import type { Metadata } from "next"

export const SITE_URL = "https://passlore.com"
export const SITE_NAME = "Passlore"

/** Bust cached third-party / preview favicons after icon updates. */
export const FAVICON_VERSION = "pl4"

/** Stable @id for JSON-LD graph (Organization); referenced by WebSite and WebApplication. */
export const ORGANIZATION_SCHEMA_ID = `${SITE_URL}/#organization`
export const WEBSITE_SCHEMA_ID = `${SITE_URL}/#website`

/**
 * Same-origin icon URLs so previews (v0, *.vercel.app) load assets from the current host,
 * not metadataBase production-only URLs.
 */
export function resolveRequestOrigin(headerList: Headers): string {
  const hostRaw = headerList.get("x-forwarded-host") ?? headerList.get("host")
  if (!hostRaw) return SITE_URL
  const host = hostRaw.split(",")[0]?.trim() ?? hostRaw
  const protoRaw =
    headerList.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? ""
  const proto =
    protoRaw ||
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https")
  return `${proto}://${host}`
}

export function siteIconsForOrigin(origin: string): NonNullable<Metadata["icons"]> {
  const base = origin.replace(/\/$/, "")
  const v = FAVICON_VERSION
  return {
    icon: [
      {
        url: `${base}/favicon.ico?v=${v}`,
        type: "image/x-icon",
        sizes: "any",
      },
      { url: `${base}/icon.svg?v=${v}`, type: "image/svg+xml" },
    ],
    apple: `${base}/icon.svg?v=${v}`,
  }
}

/** Defensible site summary for meta tags and JSON-LD (no user counts or ratings). */
export const SITE_DESCRIPTION =
  "Generate random passwords and passphrases in your browser using crypto.getRandomValues. No account required. Passwords are not sent to our servers. Optional Have I Been Pwned check uses k-anonymity (only a SHA-1 hash prefix leaves your browser). Free to use."

export const defaultMetadata: Metadata = {
  title: `Free Strong Password Generator — ${SITE_NAME}`,
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
    title: `Free Strong Password Generator — ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Passlore — Free strong password generator in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Strong Password Generator — ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const aboutMetadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description:
    `How ${SITE_NAME} works: client-side generation with the Web Crypto API, optional breach checks, and privacy-minded defaults.`,
  openGraph: {
    title: `About ${SITE_NAME}`,
    description:
      "Client-side password and passphrase generation, optional Have I Been Pwned k-anonymity checks, and how we handle data.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Passlore — Free strong password generator in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_NAME}`,
    description:
      "Client-side password and passphrase generation, optional Have I Been Pwned k-anonymity checks, and how we handle data.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

export const privacyMetadata: Metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
  description:
    `${SITE_NAME} privacy policy. Passwords are generated in your browser. We collect minimal data and explain cookies, analytics, and third parties.`,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description:
      `How ${SITE_NAME} handles your data: client-side generation, k-anonymity breach checks, cookies, and analytics.`,
    url: `${SITE_URL}/privacy`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Passlore — Free strong password generator in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy — ${SITE_NAME}`,
    description:
      `How ${SITE_NAME} handles your data: client-side generation, k-anonymity breach checks, cookies, and analytics.`,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
}

export const termsMetadata: Metadata = {
  title: `Terms of Service — ${SITE_NAME}`,
  description:
    `Terms and conditions for using ${SITE_NAME}, the free client-side password generator and security tools.`,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `Terms of Service — ${SITE_NAME}`,
    description: `Terms of service for ${SITE_NAME} — acceptable use, disclaimers, and liability.`,
    url: `${SITE_URL}/terms`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Passlore — Free strong password generator in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Service — ${SITE_NAME}`,
    description: `Terms of service for ${SITE_NAME} — acceptable use, disclaimers, and liability.`,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
}

export const blogMetadata: Metadata = {
  title: `Password Security Blog — ${SITE_NAME}`,
  description:
    "Articles on password security, passphrases, entropy, and practical guidance aligned with current standards.",
  openGraph: {
    title: `Password Security Blog — ${SITE_NAME}`,
    description:
      "Articles on password security, passphrases, entropy, and practical guidance aligned with current standards.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Passlore — Free strong password generator in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Password Security Blog — ${SITE_NAME}`,
    description:
      "Articles on password security, passphrases, entropy, and practical guidance aligned with current standards.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_SCHEMA_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/apple-icon.png?v=${FAVICON_VERSION}`,
  },
}

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_SCHEMA_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": ORGANIZATION_SCHEMA_ID,
  },
}

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
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
    "@id": ORGANIZATION_SCHEMA_ID,
  },
  publisher: {
    "@id": ORGANIZATION_SCHEMA_ID,
  },
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
  coverImage?: string
}) {
  const published = toIsoDateTime(post.datePublished)
  const modified = toIsoDateTime(post.dateModified ?? post.datePublished)
  const articleUrl = `${SITE_URL}/blog/${post.slug}`
  const imageUrl = post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    ...(imageUrl && { image: imageUrl }),
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
      "@id": articleUrl,
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
