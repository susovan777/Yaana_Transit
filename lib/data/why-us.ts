// Path: lib\data\why-us.ts

// ─────────────────────────────────────────
// WHY US DATA — Yana Transite
// ─────────────────────────────────────────

// Left column — 3 detailed USP items
export type UspItem = {
  icon: string;
  title: string;
  description: string;
};

// Right column — 4 compact feature cards
export type FeatureCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

// Bottom highlight card (navy, full-width)
export type HighlightCard = {
  icon: string;
  title: string;
  description: string;
};

export const USP_ITEMS: UspItem[] = [
  {
    icon: '✅',
    title: 'GST Invoice on Every Booking',
    description:
      'Full tax compliance for business travellers and corporate accounts. Download invoices instantly after every trip.',
  },
  {
    icon: '📞',
    title: 'Book with a Single Call or WhatsApp',
    description:
      'No app download, no complicated forms — just contact us and we handle everything within minutes.',
  },
  {
    icon: '🔒',
    title: 'No Hidden Charges — Ever',
    description:
      'What we quote is what you pay. Tolls and parking are disclosed upfront, always.',
  },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'insured',
    icon: '🛡️',
    title: 'Fully Insured Fleet',
    description:
      'Comprehensive insurance on every vehicle. Roadside assistance across all NH routes.',
  },
  {
    id: 'drivers',
    icon: '🧑‍✈️',
    title: 'Verified Drivers',
    description:
      'Police verified, language-trained, and rated by customers after every trip.',
  },
  {
    id: 'punctual',
    icon: '⏰',
    title: 'Always On Time',
    description:
      'Punctuality is non-negotiable. Driver dispatched 30 mins before your pickup.',
  },
  {
    id: 'cities',
    icon: '🌐',
    title: '50+ Cities',
    description:
      "From Tier-1 metros to pilgrim routes and hill stations — we're everywhere you go.",
  },
];

export const HIGHLIGHT_CARD: HighlightCard = {
  icon: '📱',
  title: 'Book in 2 Minutes via WhatsApp',
  description:
    'Message us your pickup location, date and car preference — we confirm within minutes. No app, no hassle.',
};
