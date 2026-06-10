// Path: app\page.tsx

// ─────────────────────────────────────────
// HOME PAGE — app/page.tsx
// ─────────────────────────────────────────

import type { Metadata } from 'next';
import HeroSection from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import FleetSection from '@/components/home/FleetSection';
import ServicesSection from '@/components/home/ServiceSection';
import WhyUsSection from '@/components/home/WhyUs';
import CitiesSection from '@/components/home/Cities';
import TestimonialsSection from '@/components/home/Testimonials';
import InquirySection from '@/components/home/InquirySection';

export const metadata: Metadata = {
  title: 'Home — Yana Transit | Car Rentals India',
  description:
    'Browse our fleet, explore services, and book your car rental across 50+ cities in India. Chauffeur-driven, self-drive and airport transfers.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FleetSection />
      <ServicesSection />
      <WhyUsSection />
      <CitiesSection />
      <TestimonialsSection />
      <InquirySection />
    </>
  );
}
