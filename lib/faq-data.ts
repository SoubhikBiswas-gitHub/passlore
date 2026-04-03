// FAQ data for Schema.org structured data and FAQ component
export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What makes a strong password?",
    answer:
      "A strong password has high entropy, meaning it's difficult to guess or crack. Key factors include: length (longer is better, at least 16 characters), character variety (uppercase, lowercase, numbers, symbols), and true randomness (not based on words or patterns). We recommend passwords with at least 80 bits of entropy for important accounts.",
  },
  {
    question: "How long should a password be?",
    answer:
      "For most accounts, we recommend at least 16 characters. For high-security accounts like your email or password manager, use 20+ characters. The longer your password, the exponentially harder it is to crack. A 16-character password with mixed character types would take trillions of years to crack with current technology.",
  },
  {
    question: "Is this password generator safe to use?",
    answer:
      "Yes, absolutely. Our password generator uses cryptographically secure random number generation (crypto.getRandomValues) built into your browser. Your passwords are generated entirely on your device and never sent to our servers. We have no way to see, store, or access any passwords you generate.",
  },
  {
    question: "What is password entropy?",
    answer:
      "Entropy measures the randomness or unpredictability of a password, expressed in bits. Each bit doubles the number of possible combinations. For example, a password with 80 bits of entropy has 2^80 possible combinations (about 1.2 septillion), making it extremely difficult to crack even with powerful computers. We display entropy in real-time so you can gauge your password strength.",
  },
  {
    question: "Passphrase vs password — which is more secure?",
    answer:
      "Both can be equally secure depending on length. Passphrases combine multiple random words (like 'correct-horse-battery-staple'), making them easier to remember while maintaining high security. A 4-6 word passphrase can have 50-80+ bits of entropy. Traditional passwords are shorter but use more character variety. Choose passphrases for passwords you type often, random passwords for those stored in a manager.",
  },
  {
    question: "How often should I change my password?",
    answer:
      "Current security guidance (including NIST) recommends against routine password changes. Only change passwords when: there's evidence of a breach, you've shared it with someone, you used it on a compromised device, or you see suspicious account activity. Frequent forced changes often lead to weaker passwords as people use predictable patterns.",
  },
  {
    question: "What are the NIST password guidelines?",
    answer:
      "NIST Special Publication 800-63B recommends: allowing long passwords (at least 64 characters), checking against breached password lists, dropping arbitrary complexity rules, eliminating periodic password changes, and using multi-factor authentication. Our generator follows these guidelines by focusing on length and true randomness over arbitrary complexity.",
  },
  {
    question: "What does 'Have I Been Pwned' check mean?",
    answer:
      "Have I Been Pwned (HIBP) is a service that tracks passwords exposed in data breaches. Our check uses k-anonymity: only the first 5 characters of your password's SHA-1 hash are sent to HIBP. Your actual password never leaves your browser. If your generated password appears in any known breach, we'll warn you so you can generate a new one.",
  },
  {
    question: "Should I use a password manager?",
    answer:
      "Absolutely! Password managers let you use unique, strong passwords for every account without memorizing them. They encrypt your vault with a master password and can auto-fill credentials. Our generator works great with password managers — generate a strong password here, then save it in your manager. Popular options include 1Password, Bitwarden, and Dashlane.",
  },
  {
    question: "What characters make a password strongest?",
    answer:
      "Using all character types (uppercase A-Z, lowercase a-z, numbers 0-9, and symbols like !@#$%^&*) maximizes your character set size, increasing entropy. However, length matters more than complexity. A 20-character lowercase password is stronger than an 8-character password with all character types. Use symbols when allowed, but prioritize length above all else.",
  },
] as const
