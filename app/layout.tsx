import { Footer } from "@/components/Footer"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"
import { GdprBanner } from "@/components/GdprBanner"
import { Header } from "@/components/Header"
import { ThemeColorMeta } from "@/components/ThemeColorMeta"
import { ThemeProvider } from "@/components/ThemeProvider"
import {
  defaultMetadata,
  resolveRequestOrigin,
  siteIconsForOrigin,
} from "@/lib/seo"
import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "optional",
  adjustFontFallback: true,
})

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers()
  const origin = resolveRequestOrigin(headerList)
  return {
    ...defaultMetadata,
    metadataBase: new URL(origin),
    icons: siteIconsForOrigin(origin),
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "sepia", "high-contrast", "system"]}
          disableTransitionOnChange={false}
        >
          <ThemeColorMeta />
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <GdprBanner />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
