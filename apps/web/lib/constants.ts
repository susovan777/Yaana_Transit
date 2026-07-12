// Path: apps\web\lib\constants.ts

// ─────────────────────────────────────────
// SITE-WIDE CONSTANTS — YAANA Transit
// Update contact details, nav links, footer
// data here. Used across Navbar, Footer, etc.
// ─────────────────────────────────────────

export const SITE = {
  name: 'YAANA Transit',
  tagline: 'Driven by Trust',
  description:
    'Corporate car rentals across 50+ cities in India. Chauffeur-driven, employee transportation, and dedicated corporate fleet — all with transparent service and verified chauffeurs.',
  phone: '+91 98765 43210',
  phoneRaw: '919876543210',
  email: 'hello@yaanatransit.com',
  address: `Site no. 32 & 33, K.No. 119, 
            Green Cliff Builders & Developers Layout,
            Mahadevakodigehalli,
            Bengaluru, Karnataka, India, 562149`,
  whatsappBase: 'https://wa.me/919876543210',
  gstNumber: '29FCMPK3672M1ZR',
  pan: '',
} as const;

export const WA_MESSAGES = {
  default: 'Hi! I want to book a car with YAANA Transit.',
  inquiry: 'Hi! I have a corporate car rental enquiry with YAANA Transit.',
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
  { label: 'Fleet', href: '/fleet' },
  { label: 'Services', href: '/services' },
  { label: 'Cities', href: '/cities' },
  { label: 'Why Us', href: '/why' },
  { label: 'Contact', href: '/contact' },
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
      { label: 'Employee Transportation (ETS)', href: '#services' },
      { label: 'Airport Transfer', href: '#services' },
      { label: 'Outstation Trips', href: '#services' },
      { label: 'Corporate Rentals', href: '#services' },
      { label: 'Events & Occasions', href: '#services' },
    ],
  },
  {
    heading: 'Our Presence',
    links: [
      { label: 'Bengaluru (HQ)', href: '#cities' },
      { label: 'New Delhi', href: '#cities' },
      { label: 'Mumbai', href: '#cities' },
      { label: 'Pune', href: '#cities' },
      { label: 'Hyderabad', href: '#cities' },
      { label: 'Chennai', href: '#cities' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Fleet', href: '/fleet' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cancellation Policy', href: '/cancellation' },
      { label: 'Client Login', href: 'https://admin.yaanatransit.com' },
    ],
  },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: string; // matches Lucide icon name used in Footer component
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'X (Twitter)', href: '#', icon: 'x' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
];

// ─────────────────────────────────────────
// FOOTER CONTACT COLUMN
// ─────────────────────────────────────────
export type ContactItem = {
  icon: string;
  label: string;
  value: string;
  href: string;
};

export const FOOTER_CONTACT: ContactItem[] = [
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@yaanatransit.com',
    href: 'mailto:hello@yaanatransit.com',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/919876543210',
  },
  {
    icon: '📍',
    label: 'Head Office',
    value: `Site no. 32 & 33, K.No. 119, 
            Green Cliff Builders & Developers Layout,
            Mahadevakodigehalli, Bengaluru, 
            Karnataka, 562149`,
    href: '#',
  },
];
