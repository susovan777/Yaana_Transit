// ─────────────────────────────────────────
// SITE-WIDE CONSTANTS — YAANA Transit
// Update contact details, nav links, footer
// data here. Used across Navbar, Footer, etc.
// ─────────────────────────────────────────

// ═════════════════════════════════════════
// 📞 PHONE NUMBERS — THE ONLY PLACE TO EDIT
// ─────────────────────────────────────────
// Rules:
//  • Digits only, WITH country code, no spaces, no "+"
//  • Example: 919876543210  →  +91 98765 43210
// Everything else (display text, tel: links, WhatsApp links) is generated automatically.
// ═════════════════════════════════════════
const PRIMARY_PHONE = '919972058882'; // ← main number (Karthik G)
const SECONDARY_PHONE = '919972058881'; // ← 2nd number (Charan V)

// Which number receives WhatsApp messages?
const WHATSAPP_PHONE = PRIMARY_PHONE; // change to SECONDARY_PHONE if needed

// ✉️ EMAIL
const EMAIL = 'hello@yaanatransit.com'; // ← main email

// 📍 ADDRESS
const ADDRESS = `Green Cliff Layout, KIADB Industrial Area, Near Airport, Bengaluru, Karnataka, 562149`; // ← full address shown on site

// ─────────────────────────────────────────
// PHONE HELPERS (no need to edit)
// ─────────────────────────────────────────
export type PhoneInfo = {
  raw: string; // 919876543210
  display: string; // +91 98765 43210
  tel: string; // tel:+919876543210
  whatsapp: string; // https://wa.me/919876543210
};

// "919876543210" → "+91 98765 43210"
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

function buildPhone(raw: string): PhoneInfo {
  const digits = raw.replace(/\D/g, '');
  return {
    raw: digits, // 919876543210
    display: formatPhone(digits), // +91 98765 43210
    tel: `tel:+${digits}`, // +919876543210
    whatsapp: `https://wa.me/${digits}`, // https://wa.me/919876543210
  };
}

export const PRIMARY = buildPhone(PRIMARY_PHONE);
export const SECONDARY = buildPhone(SECONDARY_PHONE);
export const WHATSAPP = buildPhone(WHATSAPP_PHONE);

// Use this when you want to loop over all numbers (footer, contact section)
export const PHONES: PhoneInfo[] = [PRIMARY, SECONDARY];

// ─────────────────────────────────────────
// SITE INFO
// ─────────────────────────────────────────
export const SITE = {
  name: 'YAANA Transit',
  tagline: 'Driven by Trust',
  description:
    'Corporate car rentals across 75+ cities in India. Chauffeur-driven, employee transportation, and dedicated corporate fleet — all with transparent service and verified chauffeurs.',

  // Kept for backward compatibility — existing components keep working.
  // These now point to the PRIMARY number automatically.
  phone: PRIMARY.display,
  phoneRaw: PRIMARY.raw,
  phoneTel: PRIMARY.tel,

  // Second number
  phone2: SECONDARY.display,
  phone2Raw: SECONDARY.raw,
  phone2Tel: SECONDARY.tel,

  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  address: ADDRESS,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
  whatsappBase: WHATSAPP.whatsapp,
  gstNumber: '29FCMPK3672M1ZR',
  pan: '',
} as const;

export const WA_MESSAGES = {
  default: 'Hi! I want to book a car with YAANA Transit.',
  inquiry: 'Hi! I have a corporate car rental enquiry with YAANA Transit.',
} as const;

export function buildWhatsAppUrl(
  message: string = WA_MESSAGES.default,
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
  { label: 'Home', href: '/' },
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
      { label: 'Employee Transportation', href: '#services' },
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
      { label: 'About Us', href: '/why' },
      { label: 'Our Fleet', href: '/fleet' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms and Conditions', href: '/terms-and-conditions' },
      { label: 'Common Questions', href: '/common-questions' },
      // { label: 'Client Login', href: 'https://admin.yaanatransit.com' },
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

// ─────────────────────────────────────────
// FOOTER CONTACT COLUMN
// ─────────────────────────────────────────
export type ContactIconName = 'phone' | 'mail' | 'chat' | 'map';

export type ContactItem = {
  icon: ContactIconName;
  label: string;
  lines?: { value: string; href: string }[];
  value?: string;
  href: string;
};


export const FOOTER_CONTACT: ContactItem[] = [
  {
    icon: 'phone',
    label: 'Phone',
    lines: [
      { value: SITE.phone, href: SITE.phoneTel },
      { value: SITE.phone2, href: SITE.phone2Tel },
    ],
    // value: PRIMARY.display,
    href: PRIMARY.tel,
  },
  {
    icon: 'mail',
    label: 'Email',
    value: SITE.email,
    href: SITE.emailHref,
  },
  {
    icon: 'chat',
    label: 'WhatsApp',
    value: 'Chat with us',
    href: PRIMARY.whatsapp,
  },
  {
    icon: 'map',
    label: 'Head Office',
    value: SITE.address,
    href: SITE.mapsUrl,
  },
];
