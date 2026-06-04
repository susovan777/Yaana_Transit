// ─────────────────────────────────────────
// SITE-WIDE CONSTANTS — Yana Transit
// Update contact details, nav links, footer
// data here. Used across Navbar, Footer, etc.
// ─────────────────────────────────────────

export const SITE = {
  name: 'Yana Transit',
  tagline: 'Driven by Trust',
  description:
    'Premium car rentals across 50+ cities in India. Chauffeur-driven, self-drive and corporate rentals — all with transparent pricing and verified drivers.',
  phone: '+91 98765 43210',
  phoneRaw: '919876543210',
  email: 'hello@YanaTransit.in',
  address: 'Mumbai, Maharashtra, India',
  whatsappBase: 'https://wa.me/919876543210',
} as const;

export const WA_MESSAGES = {
  default: 'Hi! I want to book a car with Yana Transit.',
  inquiry: 'Hi! I have a car rental enquiry.',
} as const;

export function buildWhatsAppUrl(
  message: string = WA_MESSAGES.default
): string {
  return `${SITE.whatsappBase}?text=${encodeURIComponent(message)}`;
}

// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────
export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Fleet', href: '#fleet' },
  { label: 'Services', href: '#services' },
  { label: 'Cities', href: '#cities' },
  { label: 'Why Us', href: '#why' },
  { label: 'Contact', href: '#inquiry' },
];

// ─────────────────────────────────────────
// FOOTER DATA
// ─────────────────────────────────────────
export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Chauffeur-Driven', href: '#services' },
      { label: 'Self-Drive', href: '#services' },
      { label: 'Airport Transfer', href: '#services' },
      { label: 'Outstation Trips', href: '#services' },
      { label: 'Corporate Rentals', href: '#services' },
      { label: 'Events & Groups', href: '#services' },
    ],
  },
  {
    heading: 'Top Cities',
    links: [
      { label: 'Mumbai', href: '#cities' },
      { label: 'New Delhi', href: '#cities' },
      { label: 'Bengaluru', href: '#cities' },
      { label: 'Goa', href: '#cities' },
      { label: 'Jaipur', href: '#cities' },
      { label: 'Hyderabad', href: '#cities' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Fleet', href: '#fleet' },
      { label: 'Contact', href: '#inquiry' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cancellation Policy', href: '/cancellation' },
    ],
  },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: string; // text character — replaced with Lucide in component
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'X (Twitter)', href: '#', icon: 'x' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
];
