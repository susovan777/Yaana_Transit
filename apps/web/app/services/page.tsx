// Path: apps\web\app\services\page.tsx

// Services page — /services
//
// Architecture: Full Server Component.
// No client state needed — all 6 service cards are
// static content. Framer Motion scroll animations
// are handled via whileInView inside the child
// component (ServicesGrid), which is "use client".
//
// SEO: generateMetadata gives each page its own
// <title> and <meta description> — critical for
// ranking on search terms like "airport transfer
// Mumbai" or "outstation car rental India".

import type { Metadata } from 'next';
import { SERVICES } from '@/lib/data/services';
import { SITE } from '@/lib/constants';
import ServicesGrid from '@/components/services/ServicesGrid';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

// ── SEO metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Our Services — ${SITE.name}`,
  description:
    'Chauffeur-driven rides, employee transportation, airport transfers, outstation trips, corporate leasing and event fleets — all across 50+ cities in India.',
  openGraph: {
    title: `Our Services — ${SITE.name}`,
    description:
      'Every kind of ride, across every city in India. Book via WhatsApp in minutes.',
    url: '/services',
  },
};

// ── Why-us trust points (shown in the bottom banner) ───────────────
const TRUST_POINTS = [
  { icon: '🛡️', text: 'Fully Insured Fleet' },
  { icon: '✅', text: 'Verified Chauffeurs' },
  { icon: '🔒', text: 'No Hidden Charges' },
  { icon: '📞', text: '24 / 7 Support' },
];

// ── Page ────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[#1C1F26] pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Glow */}
        <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(46,111,216,0.3)_0%,transparent_70%)]" />

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
              <li className="text-white/60">Services</li>
            </ol>
          </nav>

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[#6B96D4] text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B96D4] animate-pulse" />
            What We Offer
          </div>

          <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
            Services Built for{' '}
            <em className="not-italic text-[#6B96D4]">India</em>
          </h1>

          <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl">
            From airport transfers to cross-state road trips — every service is
            built around how Indians actually travel. Book in minutes via
            WhatsApp or a single call.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              { value: '6', label: 'Service types' },
              { value: '50+', label: 'Cities covered' },
              { value: '15 min', label: 'Avg. response time' },
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

      {/* ── Services grid (client — needs whileInView) ──────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <ServicesGrid services={SERVICES} />
      </section>

      {/* ── "How to Book" steps ─────────────────────────────────── */}
      <section className="bg-[#1C1F26] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#6B96D4] text-xs font-semibold tracking-[2px] uppercase mb-3">
              How It Works
            </p>
            <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-white">
              On the Road in{' '}
              <em className="not-italic text-[#6B96D4]">3 Minutes</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Choose a Service',
                desc: 'Pick the service type that fits your journey — city ride, airport run, outstation, or corporate.',
              },
              {
                step: '02',
                icon: '💬',
                title: 'WhatsApp or Call',
                desc: "Tap 'Book Now' and a pre-filled WhatsApp message opens instantly. Or just call us directly.",
              },
              {
                step: '03',
                icon: '✅',
                title: 'Get Confirmed',
                desc: 'Receive booking confirmation, chauffeur name, and vehicle details on WhatsApp before your trip.',
              },
              {
                step: '04',
                icon: '🚗',
                title: 'Travel Comfortably',
                desc: 'Your car arrives at your doorstep. Sit back — we handle everything from here.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-8 bg-white/3 hover:bg-white/[0.07] transition-colors duration-300 relative"
              >
                <p className="font-poppins text-5xl font-semibold text-white/6 leading-none mb-4">
                  {item.step}
                </p>
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-poppins text-base font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {TRUST_POINTS.map((t, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-lg">{t.icon}</span>
              <span className="text-sm font-medium text-slate-600">
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-poppins text-2xl md:text-3xl font-semibold text-[#1C1F26] mb-3">
            Not sure which service fits?
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-lg mx-auto">
            Just tell us where you're going and when — our team will recommend
            the right option and confirm pricing in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(
                'Hi YAANA Transit! I need help choosing the right service for my trip.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#1C1F26] hover:bg-[#3A6AB6] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A6AB6]/25 w-full sm:w-auto justify-center"
            >
              {/* WhatsApp icon */}
              <WhatsAppIcon size={18} />
              Chat on WhatsApp
            </Link>
            <Link
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2.5 border border-slate-200 hover:border-[#1C1F26] text-slate-600 hover:text-[#1C1F26] font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
            >
              📞 {SITE.phone}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
