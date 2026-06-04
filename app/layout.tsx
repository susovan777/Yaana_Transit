// Path: app\layout.tsx

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

// ─────────────────────────────────────────
// FONTS — loaded via next/font (zero layout shift, self-hosted, no external request)
// ─────────────────────────────────────────
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

// ─────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Yana Transit — Driven by Trust',
    template: '%s | Yana Transit',
  },
  description:
    'Premium car rentals across 50+ cities in India. Chauffeur-driven, self-drive and corporate rentals with transparent pricing and verified drivers.',
  keywords: [
    'car rental India',
    'chauffeur driven',
    'self drive',
    'airport transfer',
    'outstation trip',
    'corporate car rental',
  ],
  authors: [{ name: 'Yana Transit' }],
  creator: 'Yana Transit',
  openGraph: {
    title: 'Yana Transit — Driven by Trust',
    description:
      'Premium car rentals across 50+ cities in India. Chauffeur-driven, self-drive and corporate rentals.',
    url: 'https://YanaTransit.in',
    siteName: 'Yana Transit',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yana Transit — Driven by Trust',
    description: 'Premium car rentals across 50+ cities in India.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1F3A',
};

// ─────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-white text-navy overflow-x-hidden">
        {/* Sticky navigation */}
        <Navbar />

        {/* Page content — push down by nav height */}
        <main className="pt-[68px]">{children}</main>

        {/* Site-wide footer */}
        <Footer />

        {/* Floating WhatsApp CTA */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
