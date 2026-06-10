// Path: data\testimonials.ts

// ─────────────────────────────────────────
// TESTIMONIALS DATA — Yana Transite
// ─────────────────────────────────────────

export type Testimonial = {
  id: string;
  text: string;
  rating: number;
  name: string;
  city: string;
  service: string;
  initial: string;
  avatarBg: string; // Tailwind bg class
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya-sharma',
    text: 'Used Yana Transite for our Rajasthan trip. Driver Ramesh was professional, on time, and knew every stop along the way. Absolutely hassle-free experience!',
    rating: 5,
    name: 'Priya Sharma',
    city: 'Mumbai',
    service: 'Outstation Trip',
    initial: 'P',
    avatarBg: 'bg-[#1A4A7A]',
  },
  {
    id: 'arjun-mehta',
    text: 'Booked a self-drive in Goa within minutes via WhatsApp. Car was spotless, AC was cold, and the return was smooth. Best rental experience in Goa, hands down.',
    rating: 5,
    name: 'Arjun Mehta',
    city: 'Bengaluru',
    service: 'Self-Drive',
    initial: 'A',
    avatarBg: 'bg-[#0D2A52]',
  },
  {
    id: 'sunita-reddy',
    text: 'Our company uses Yana Transite for all corporate travel. GST invoices, dedicated point of contact, always punctual. Exactly what a business needs.',
    rating: 5,
    name: 'Sunita Reddy',
    city: 'Hyderabad',
    service: 'Corporate Rental',
    initial: 'S',
    avatarBg: 'bg-[#1E5490]',
  },
];
