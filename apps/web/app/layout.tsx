// Path: app\layout.tsx

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Outfit, Playfair_Display, Poppins } from 'next/font/google';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollToTop from '@/components/ui/ScrollToTop';

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

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

// ─────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'YAANA Transit — Driven by Trust',
    template: '%s | YAANA Transit',
  },
  description:
    'Premium car rentals across 50+ cities in India. Chauffeur-driven, self-drive and corporate rentals with transparent pricing and verified drivers.',
  icons: {
    icon: '/favicon.png',
  },
  keywords: [
    'car rental India',
    'chauffeur driven',
    'self drive',
    'airport transfer',
    'outstation trip',
    'corporate car rental',
  ],
  authors: [{ name: 'YAANA Transit' }],
  creator: 'YAANA Transit',
  openGraph: {
    title: 'YAANA Transit — Driven by Trust',
    description:
      'Premium car rentals across 50+ cities in India. Chauffeur-driven, self-drive and corporate rentals.',
    url: 'https://YAANATransit.in',
    siteName: 'YAANA Transit',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAANA Transit — Driven by Trust',
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
  themeColor: '#1C1F26',
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
      className={`${outfit.variable} ${poppins.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-white text-navy overflow-x-hidden">
        {/* Sticky navigation */}
        <Navbar />

        {/* Page content — push down by nav height */}
        <main>{children}</main>

        {/* Site-wide footer */}
        <Footer />

        {/* Floating WhatsApp CTA */}
        <WhatsAppButton />

        {/* Scroll to Top button */}
        <ScrollToTop />
      </body>
    </html>
  );
}
