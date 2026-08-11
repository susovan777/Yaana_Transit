// Path: data\testimonials.ts

// ─────────────────────────────────────────
// TESTIMONIALS DATA — YAANA Transite
// ─────────────────────────────────────────

export type Testimonial = {
  id: string;
  text: string;
  rating: number;
  name: string;
  city: string;
  designation: string;
  companyType: string;
  service: string;
  initial: string;
  avatarBg: string; // Tailwind bg class
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya-sharma',
    text: 'YAANA Transit handles our executive airport transfers across major metros seamlessly. Their real-time flight tracking and uniformed chauffeurs ensure our C-suite guests and delegates are always received on time.',
    rating: 5,
    name: 'Priya Sharma',
    city: 'Mumbai',
    designation: 'Head of Administration',
    companyType: 'Fintech Enterprise',
    service: 'Executive Mobility',
    initial: 'P',
    avatarBg: 'bg-[#1A4A7A]',
  },
  {
    id: 'arjun-mehta',
    text: 'Managing ground transport for our annual 300+ attendee leadership summit was completely hassle-free with YAANA. Their fleet coordination, transparent billing, and dedicated account management are unmatched.',
    rating: 5,
    name: 'Arjun Mehta',
    city: 'Bengaluru',
    designation: 'VP of Corporate Operations',
    companyType: 'IT Solutions Global',
    service: 'Events & Corporate Delegation',
    initial: 'A',
    avatarBg: 'bg-[#0D2A52]',
  },
  {
    id: 'sunita-reddy',
    text: 'We rely on YAANA Transit for all our corporate travel and employee transportation needs. Automated GST-compliant invoicing, isolated client portal access, and 100% punctual chauffeurs make them an invaluable partner.',
    rating: 5,
    name: 'Sunita Reddy',
    city: 'Hyderabad',
    designation: 'Senior Procurement Manager',
    companyType: 'Pharma Multinational',
    service: 'Corporate Rental & Leasing',
    initial: 'S',
    avatarBg: 'bg-[#1E5490]',
  },
];
