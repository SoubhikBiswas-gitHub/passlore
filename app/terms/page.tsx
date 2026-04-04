import type { Metadata } from "next"
import { LegalPageShell, LegalSection } from "@/components/legal/LegalPageShell"
import { termsMetadata, getBreadcrumbSchema, SITE_URL } from "@/lib/seo"
import { LEGAL_HERO_TERMS } from "@/lib/legalHeroImages"

export const metadata: Metadata = termsMetadata

const toc = [
  { id: "acceptance", label: "Acceptance of terms" },
  { id: "description", label: "Description of service" },
  { id: "use", label: "Use of service" },
  { id: "warranty", label: "No warranty" },
  { id: "liability", label: "Limitation of liability" },
  { id: "password-disclaimer", label: "Password security disclaimer" },
  { id: "ip", label: "Intellectual property" },
  { id: "third-party", label: "Third-party services" },
  { id: "changes", label: "Changes to terms" },
  { id: "governing-law", label: "Governing law" },
  { id: "contact", label: "Contact" },
] as const

const lastUpdated = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

export default function TermsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Terms", url: `${SITE_URL}/terms` },
  ])

  return (
    <LegalPageShell
      breadcrumbJsonLd={JSON.stringify(breadcrumbSchema)}
      documentLabel="Legal · Terms"
      titleLine="Terms of service &"
      titleAccent="acceptable use"
      lastUpdatedLabel={`Last updated · ${lastUpdated}`}
      heroImageSrc={LEGAL_HERO_TERMS}
      heroImageAlt="Abstract brutalist illustration suggesting legal structure, grids, and policy layers"
      toc={toc}
      statusLines={["Classification: public", "Transport: HTTPS (TLS negotiated)", "Scope: passlore.com"]}
      crossLinkHref="/privacy"
      crossLinkText="Read privacy policy"
    >
      <LegalSection id="acceptance" title="1. Acceptance of terms" isFirst>
        <p>
          By using Passlore (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree,
          do not use the Service.
        </p>
      </LegalSection>

      <LegalSection id="description" title="2. Description of service">
        <p>
          Passlore is a free, web-based password and passphrase generator. Core generation runs in your browser;
          optional features (such as breach lookup) only send the minimum data described in our privacy policy.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. Use of service">
        <p>You agree to use the Service only for lawful purposes. You may not:</p>
        <ul>
          <li>Use the Service for illegal activity</li>
          <li>Attempt to disrupt, overload, or compromise the Service</li>
          <li>Reverse engineer or scrape the Service in ways that violate applicable law or our infrastructure limits</li>
          <li>Use automated access in a manner that impairs availability for others</li>
        </ul>
      </LegalSection>

      <LegalSection id="warranty" title="4. No warranty">
        <p>
          The Service is provided <strong>as is</strong> and <strong>as available</strong>, without warranties of any
          kind, whether express or implied. We do not guarantee uninterrupted, error-free, or vulnerability-free
          operation.
        </p>
        <p>
          Cryptographic routines rely on your browser and operating environment. You are responsible for verifying
          suitability for your threat model.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="5. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Passlore and its contributors are not liable for indirect,
          incidental, special, consequential, or punitive damages, or for loss of data, profits, or goodwill, arising
          from your use of the Service.
        </p>
        <p>
          We are not responsible for losses stemming from how you store, share, or reuse generated credentials, or from
          compromises of third-party services you use.
        </p>
      </LegalSection>

      <LegalSection id="password-disclaimer" title="6. Password security disclaimer">
        <p>Strong passwords are one layer in a broader security program. Account safety also depends on:</p>
        <ul>
          <li>How you store and rotate credentials (e.g. password manager)</li>
          <li>Security practices of the services you use</li>
          <li>Use of phishing-resistant MFA where available</li>
          <li>Device hygiene and software updates</li>
        </ul>
        <p>We recommend a reputable password manager and MFA on high-value accounts.</p>
      </LegalSection>

      <LegalSection id="ip" title="7. Intellectual property">
        <p>
          The Service, including design, branding, and code, is protected by intellectual property laws. You may not
          copy, modify, or redistribute it without permission, except as allowed by applicable law (e.g. fair use).
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="8. Third-party services">
        <p>
          Integrations such as Have I Been Pwned are subject to their own terms. Your use of those features constitutes
          acceptance of the relevant third-party conditions.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to terms">
        <p>
          We may update these terms. Changes take effect when posted on this page. Continued use after updates
          constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="10. Governing law">
        <p>
          These terms are governed by the laws applicable to the jurisdiction in which Passlore operates,
          without regard to conflict-of-law rules, except where mandatory consumer protections in your country apply.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="11. Contact">
        <p>
          For questions about these terms:{" "}
          <a href="mailto:legal@passlore.com">legal@passlore.com</a>
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
