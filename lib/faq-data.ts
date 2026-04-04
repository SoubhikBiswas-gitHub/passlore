/** FAQ copy for the home accordion; JSON-LD is derived from the same list via `getFaqPageJsonLd`. */
export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What makes a strong password?",
    answer:
      "A strong password has high entropy: it is hard to guess or crack. Practical factors include length (often 16+ characters for general accounts), variety of characters when using random strings, and randomness (avoid personal information and predictable patterns). More bits of entropy mean a larger search space under idealized assumptions—real risk also depends on how sites store and hash passwords.",
  },
  {
    question: "How long should a password be?",
    answer:
      "A common baseline is at least 16 characters; use more for high-value accounts (email, password manager). Longer secrets increase the search space. Actual resistance depends on the threat model—for example online rate-limited login vs offline cracking of a stolen hash—so focus on length, randomness, and uniqueness per site.",
  },
  {
    question: "Is this password generator safe to use?",
    answer:
      "Passwords and passphrases are assembled in your browser using crypto.getRandomValues, with indices chosen without modulo bias. They are not sent to our servers for generation. If you use the optional Have I Been Pwned check, only the first five hexadecimal characters of the password's SHA-1 hash are sent (k-anonymity); the plaintext password is not transmitted.",
  },
  {
    question: "What is password entropy?",
    answer:
      "Entropy describes unpredictability, often in bits. Under simple models, each extra bit doubles the number of equally likely values. This app estimates entropy from character set size and length (or wordlist size for passphrases). Treat the number as guidance: real attacks depend on many factors beyond the estimate alone.",
  },
  {
    question: "Passphrase vs password — which is more secure?",
    answer:
      "Either can be strong if it is long and random enough. Passphrases built from randomly chosen words (for example from a large list such as the EFF long list) can be memorable and high-entropy. Random character strings pair well with a password manager. Avoid famous quotes, song lyrics, or well-known examples—they appear in attack dictionaries.",
  },
  {
    question: "How often should I change my password?",
    answer:
      "NIST SP 800-63B and similar guidance de-emphasize rotating passwords on a fixed schedule without cause. Change a password when you suspect or know compromise, after a breach affecting that secret, or when a service requires it—not solely because a calendar said so.",
  },
  {
    question: "What are the NIST password guidelines?",
    answer:
      "NIST Special Publication 800-63B (memorized secrets) emphasizes long passwords, checking against breached-password lists, avoiding arbitrary composition rules that hurt usability, not requiring periodic changes without reason, and leaning on MFA. This tool supports long random secrets and optional breach checking; it is not a formal NIST certification.",
  },
  {
    question: "What does 'Have I Been Pwned' check mean?",
    answer:
      "Have I Been Pwned publishes known breached password hashes. We SHA-1 hash your password locally, send only the first five hexadecimal characters of that hash to HIBP's range API, then match the remainder of the hash locally against the returned bucket. Your plaintext password is not sent. We send HIBP's recommended Add-Padding header to reduce observer inference.",
  },
  {
    question: "Should I use a password manager?",
    answer:
      "For most people, yes—a reputable password manager helps you use unique secrets per site. You can generate a random password here and store it in your manager. Examples of widely used managers include 1Password, Bitwarden, and Dashlane; choose one you trust and enable MFA on the vault.",
  },
  {
    question: "What characters make a password strongest?",
    answer:
      "A larger alphabet (uppercase, lowercase, digits, symbols) increases entropy per character when characters are chosen uniformly. Length usually dominates: a long random password from a smaller alphabet can beat a short one from a larger alphabet. Use the longest secret the service allows, generated randomly.",
  },
] as const

export function getFaqPageJsonLd(): {
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity: {
    "@type": "Question"
    name: string
    acceptedAnswer: { "@type": "Answer"; text: string }
  }[]
} {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
