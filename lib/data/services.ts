// Path: data\services.ts

// ─────────────────────────────────────────
// SERVICES DATA — Yana Transite
// Each service maps to a card in ServicesSection.
// priceLabel is the display string shown on the card.
// ─────────────────────────────────────────

export type Service = {
  id: string;
  icon: string; // emoji icon
  name: string;
  description: string;
  priceLabel: string;
  waMessage: string; // pre-filled WhatsApp message
};

export const SERVICES: Service[] = [
  {
    id: 'chauffeur-driven',
    icon: '👨‍✈️',
    name: 'Chauffeur-Driven',
    description:
      'Sit back, relax and arrive in comfort. Our vetted, uniformed drivers know every city road and outstation route across India.',
    priceLabel: 'Starts ₹1,200 / day',
    waMessage:
      "Hi! I'm interested in a Chauffeur-Driven car rental with Yana Transite.",
  },
  {
    id: 'self-drive',
    icon: '🗝️',
    name: 'Self-Drive',
    description:
      'Take the wheel yourself. Well-maintained cars, flexible pickup, and GPS included — your adventure, your pace.',
    priceLabel: 'Starts ₹999 / day',
    waMessage: "Hi! I'm interested in a Self-Drive rental with Yana Transite.",
  },
  {
    id: 'airport-transfer',
    icon: '✈️',
    name: 'Airport Transfers',
    description:
      "On-time pickups and drops at all major airports. Flight tracking included — we wait even if you're delayed.",
    priceLabel: 'Starts ₹799 / transfer',
    waMessage: 'Hi! I need an Airport Transfer booking with Yana Transite.',
  },
  {
    id: 'outstation',
    icon: '🛣️',
    name: 'Outstation Trips',
    description:
      'One-way or round-trip. Rajasthan, Kerala, Himachal — our drivers handle long-distance with ease and care.',
    priceLabel: 'Starts ₹12 / km',
    waMessage: 'Hi! I want to book an Outstation Trip with Yana Transite.',
  },
  {
    id: 'corporate',
    icon: '🏢',
    name: 'Corporate Rentals',
    description:
      'Managed accounts, GST invoices, monthly billing and a dedicated fleet for your business travel needs.',
    priceLabel: 'Custom pricing',
    waMessage:
      "Hi! I'm interested in Corporate Rental services from Yana Transite.",
  },
  {
    id: 'events',
    icon: '🎉',
    name: 'Events & Occasions',
    description:
      'Weddings, conferences, pilgrimages — book a fleet. Tempo Travellers and luxury cars available for groups.',
    priceLabel: 'Starts ₹4,500 / day',
    waMessage:
      'Hi! I want to book cars for an Event or Occasion with Yana Transite.',
  },
];
