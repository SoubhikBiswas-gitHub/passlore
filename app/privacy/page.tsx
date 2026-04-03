import type { Metadata } from "next"
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell"
import { privacyMetadata, getBreadcrumbSchema } from "@/lib/seo"
import { LEGAL_HERO_PRIVACY } from "@/lib/legalHeroImages"

export const metadata: Metadata = privacyMetadata

const toc = [
  { id: "overview", label: "Overview" },
  { id: "password-generation", label: "Password generation" },
  { id: "breach-detection", label: "Breach detection" },
  { id: "analytics", label: "Analytics" },
  { id: "cookies", label: "Cookies" },
  { id: "third-party", label: "Third-party services" },
  { id: "your-rights", label: "Your rights" },
  { id: "contact", label: "Contact" },
] as const

const lastUpdated = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://securepass.pro" },
    { name: "Privacy", url: "https://securepass.pro/privacy" },
  ])

  return (
    <LegalPageShell
      breadcrumbJsonLd={JSON.stringify(breadcrumbSchema)}
      documentLabel="Legal · Privacy"
      titleLine="Privacy policy &"
      titleAccent="data handling"
      lastUpdatedLabel={`Last updated · ${lastUpdated}`}
      heroImageSrc={LEGAL_HERO_PRIVACY}
      heroImageAlt="Abstract brutalist illustration suggesting data boundaries, shield geometry, and privacy"
      toc={toc}
      statusLines={["Classification: public", "Transport: HTTPS (TLS negotiated)", "Scope: securepass.pro"]}
      crossLinkHref="/terms"
      crossLinkText="Read terms of service"
    >
      <LegalSection id="overview" title="Overview" isFirst>
        <p>
          SecurePass Pro is built with privacy as a core principle. Password tools should protect your data — not
          harvest it.
        </p>
      </LegalSection>

      <LegalSection id="password-generation" title="Password generation">
        <p>
          <strong>Your passwords never leave your browser.</strong> Generation runs entirely on your device using
          JavaScript and the Web Crypto API. We cannot see, store, or recover passwords you create.
        </p>
        <p>
          Session history is kept in <strong>session storage</strong> only for your current tab session and is cleared
          when you close the tab.
        </p>
      </LegalSection>

      <LegalSection id="breach-detection" title="Breach detection">
        <p>Optional checks use the Have I Been Pwned API with k-anonymity:</p>
        <ul>
          <li>Your password is hashed with SHA-1 locally in the browser</li>
          <li>Only the first five characters of the hash prefix are sent to HIBP</li>
          <li>Your browser compares the full hash against the returned bucket locally</li>
        </ul>
        <p>The plaintext password is not transmitted over the network.</p>
      </LegalSection>

      <LegalSection id="analytics" title="Analytics">
        <p>
          We may use privacy-preserving analytics (e.g. Vercel Analytics) for aggregated traffic insight — page views; device class; coarse region. We do not use it to build individual profiles or sell data.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>We use minimal first-party cookies for essential functionality:</p>
        <ul>
          <li>
            <strong>Theme preference</strong> — remembers light, dark, or system theme
          </li>
          <li>
            <strong>GDPR consent</strong> — stores your cookie banner choice where applicable
          </li>
        </ul>
        <p>These are not used for cross-site advertising.</p>
      </LegalSection>

      <LegalSection id="third-party" title="Third-party services">
        <ul>
          <li>
            <strong>Have I Been Pwned</strong> — optional breach lookup (k-anonymity as above)
          </li>
          <li>
            <strong>Hosting / CDN</strong> — delivery of the static site and edge functions
          </li>
        </ul>
        <p>
          We do not load advertising or social trackers until you accept optional cookies where applicable. Core
          password generation does not require ad scripts.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="Your rights">
        <p>
          Where GDPR and similar laws apply, you may exercise rights over personal data. Because we minimize collection,
          most control is in your hands:
        </p>
        <ul>
          <li>Clear site data in your browser to remove preferences and session history</li>
          <li>Use browser or extension controls to limit analytics</li>
          <li>Withdraw consent by clearing cookies and reloading the site</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about this policy:{" "}
          <a href="mailto:privacy@securepass.pro">privacy@securepass.pro</a>
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
