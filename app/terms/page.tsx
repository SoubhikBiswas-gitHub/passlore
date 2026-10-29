import type { Metadata } from "next"
import { LegalShell, type LegalSectionData } from "@/components/legal/LegalShell"
import { REPO_URL } from "@/components/content/links"
import { termsMetadata } from "@/lib/seo"

export const metadata: Metadata = termsMetadata

const sections: LegalSectionData[] = [
  {
    id: "use",
    h: "Using Passlore",
    body: <p>Passlore is free to use for any lawful purpose. There is no account and nothing to buy.</p>,
  },
  {
    id: "warranty",
    h: "No warranty",
    body: (
      <p>
        Passlore is provided “as is” under the <a href={`${REPO_URL}/blob/main/LICENSE`}>MIT licence</a>, without
        warranty of any kind. Passlore and its contributors are not liable for any loss arising from its use.
      </p>
    ),
  },
  {
    id: "estimates",
    h: "Estimates are not guarantees",
    body: (
      <p>
        Strength and time-to-guess figures are estimates based on stated assumptions. They are not a certification of
        security. The rules reader matches common phrasing; always check the result against the site.
      </p>
    ),
  },
  {
    id: "yours",
    h: "Your responsibility",
    body: (
      <p>
        Store generated passwords securely, ideally in a password manager. Downloaded files and Wi-Fi QR images are
        unencrypted; you are responsible for deleting them.
      </p>
    ),
  },
  {
    id: "third",
    h: "Third-party services",
    body: (
      <p>The optional breach check uses Have I Been Pwned, which is operated independently and has its own terms.</p>
    ),
  },
  {
    id: "changes",
    h: "Changes and contact",
    body: (
      <p>
        We may update these terms; the date above shows the latest version. Contact:{" "}
        <a href="mailto:legal@passlore.com">legal@passlore.com</a>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalShell
      doc="/terms"
      title="Terms of use"
      intro="Short, plain terms for a free, open-source tool."
      sections={sections}
    />
  )
}
