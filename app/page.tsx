// Path: app\page.tsx

// ─────────────────────────────────────────
// HOME PAGE — app/page.tsx
//
// Sections will be added one by one:
//   1. HeroSection
//   2. TrustStrip
//   3. FleetSection
//   4. ServicesSection
//   5. WhyUsSection
//   6. CitiesSection
//   7. TestimonialsSection
//   8. InquirySection
// ─────────────────────────────────────────

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home — Yana Transit | Car Rentals India',
  description:
    'Browse our fleet, explore services, and book your car rental across 50+ cities in India. Chauffeur-driven, self-drive and airport transfers.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1
        className="text-4xl font-bold text-navy mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Yana <span className="text-sky-brand">Transit</span>
      </h1>
      <p className="text-muted text-lg max-w-md leading-relaxed">
        Sections are being built one by one. Navbar, Footer &amp; WhatsApp
        button are live. Next up:{' '}
        <strong className="text-navy">HeroSection</strong>.
      </p>
    </div>
  );
}
