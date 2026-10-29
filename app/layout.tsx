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
import Script from "next/script"
import { JetBrains_Mono, Plus_Jakarta_Sans, Sora } from "next/font/google"
import "./globals.css"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
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

// Sets data-theme before first paint; next-themes' own script is patched out.
const THEME_SCRIPT = `(function(){try{var d=document.documentElement,k="theme",t=localStorage.getItem(k);if(t==="high-contrast"){t="hc";localStorage.setItem(k,t)}if(["system","light","dark","sepia","hc"].indexOf(t)<0)t="system";d.setAttribute("data-theme",t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t)}catch(e){}})()`

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
    <html
      lang="en"
      className={`${sora.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className="font-sans min-h-screen flex flex-col"
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "sepia", "hc"]}
          disableTransitionOnChange
        >
          <ThemeColorMeta />
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <GdprBanner />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
