// Path: apps\web\app\fleet\page.tsx

// Fleet listing page — /fleet
//
// Architecture:
//   • This file is a SERVER COMPONENT (no "use client")
//     → Next.js renders it on the server → good for SEO,
//       fast initial paint, no JS needed for static content.
//
//   • FleetClient (below) is the ONLY client component here.
//     It holds filter state and renders FilterBar + CarGrid.
//     Keeping the client boundary as small as possible is a
//     Next.js App Router best practice.
//
// SEO:
//   • generateMetadata exports page-level meta tags.
//   • The car grid is server-rendered on first load so
//     Google sees all cars without running JavaScript.

import type { Metadata } from 'next';
import { FLEET } from '@/lib/data/fleet';
import { SITE } from '@/lib/constants';
import FleetClient from '@/components/fleet/FleetClient';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

// ── SEO metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Our Fleet — ${SITE.name}`,
  description:
    'Browse our complete fleet — economy hatchbacks, comfortable sedans, spacious SUVs and luxury executive cars. Available across 50+ cities in India.',
  openGraph: {
    title: `Our Fleet — ${SITE.name}`,
    description:
      'Economy to luxury — the right car for every journey across India.',
    url: '/fleet',
  },
};

// ── Page (Server Component) ─────────────────────────────────────────
export default function FleetPage() {
  // Data fetched at build time (static) — swap for fetch() when API is ready
  const allCars = FLEET;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Page hero ──────────────────────────────────────────── */}
      <section className="bg-[#1C1F26] pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Dot pattern — matches homepage hero */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Blue glow */}
        <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(46,111,216,0.3)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/40">
              <li>
                <Link
                  href="/"
                  className="hover:text-white/70 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li className="text-white/60">Fleet</li>
            </ol>
          </nav>

          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[#6B96D4] text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B96D4] animate-pulse" />
            Our Fleet
          </div>

          <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
            Vehicles for{' '}
            <em className="not-italic text-[#6B96D4]">Every Journey</em>
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl">
            Sedan to luxury — every vehicle is chauffeur-driven, fully insured,
            and available across 50+ cities for your corporate travel needs.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              { value: `${allCars.length}+`, label: 'Vehicles' },
              { value: '6', label: 'Categories' },
              { value: '50+', label: 'Cities Covered' },
              { value: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-poppins text-3xl font-semibold text-white leading-none">
                  {s.value}
                </p>
                <p className="text-white/40 text-xs mt-1 tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet grid (client component) ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <FleetClient cars={allCars} />
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-[#1C1F26] mb-3">
            Can't find the right car?
          </h2>
          <p className="text-slate-500 text-base mb-8">
            WhatsApp us your requirements — pickup city, dates, and group size.
            We'll find the perfect vehicle and confirm within minutes.
          </p>
          <Link
            href={`https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(
              'Hi YAANA Transit! I need help finding the right car for my trip.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1C1F26] hover:bg-[#3A6AB6] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A6AB6]/25"
          >
            {/* WhatsApp icon */}
            <WhatsAppIcon size={18} />
            Chat on WhatsApp
          </Link>
        </div>
      </section>
    </main>
  );
}
