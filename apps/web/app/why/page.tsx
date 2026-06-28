// Path: apps/web/app/why/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { USP_ITEMS, FEATURE_CARDS, HIGHLIGHT_CARD } from '@/lib/data/why-us';
import { SITE, buildWhatsAppUrl } from '@/lib/constants';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

// ── SEO metadata ─────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Why Choose Us — ${SITE.name}`,
  description:
    'GST-compliant invoicing, verified chauffeurs, zero hidden charges, and 24/7 support across 50+ cities. Here is why 500+ corporates trust YAANA Transit.',
  openGraph: {
    title: `Why Choose Us — ${SITE.name}`,
    description:
      'Transparent pricing, professional chauffeurs, and a single point of contact for all your corporate travel needs.',
    url: '/why',
  },
};

// ── Supporting proof points (page-only, not in why-us.ts) ────────────
const PROOF_POINTS = [
  { value: '500+', label: 'Corporate Clients' },
  { value: '50K+', label: 'Trips Completed' },
  { value: '98%', label: 'On-Time Rate' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '50+', label: 'Cities Covered' },
  { value: '24/7', label: 'Support Available' },
];

// ── Comparison table data ─────────────────────────────────────────────
const COMPARISON = [
  {
    feature: 'GST-compliant invoicing',
    yaana: true,
    others: false,
  },
  {
    feature: 'Dedicated corporate account manager',
    yaana: true,
    others: false,
  },
  {
    feature: 'Verified & uniformed chauffeurs',
    yaana: true,
    others: false,
  },
  {
    feature: 'No hidden charges — tolls disclosed upfront',
    yaana: true,
    others: false,
  },
  {
    feature: 'Multi-city single-contract coverage',
    yaana: true,
    others: false,
  },
  {
    feature: 'WhatsApp booking in under 2 minutes',
    yaana: true,
    others: true,
  },
  {
    feature: 'Real-time chauffeur tracking',
    yaana: true,
    others: true,
  },
  {
    feature: '24/7 human support (no bots)',
    yaana: true,
    others: false,
  },
];

// ── Page ─────────────────────────────────────────────────────────────
export default function WhyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-[#1C1F26] pt-32 pb-20 px-6 relative overflow-hidden">
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
        <div className="absolute top-[-100px] right-[-80px] w-[600px] h-[600px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(46,111,216,0.28)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(46,111,216,0.12)_0%,transparent_70%)]" />

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
              <li className="text-white/60">Why Us</li>
            </ol>
          </nav>

          {/* Two-column hero layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[#6B96D4] text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B96D4] animate-pulse" />
                Why YAANA Transit
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Corporate Travel,{' '}
                <em className="not-italic text-[#6B96D4]">Done Right</em>
              </h1>

              <p className="text-white/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                500+ companies trust YAANA Transit for their employee transport,
                executive travel, and event fleets — because we eliminate every
                friction point between your team and a comfortable, on-time
                ride.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={buildWhatsAppUrl(
                    'Hi YAANA Transit! I want to know more about your corporate travel services.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#3A6AB6] hover:bg-[#2560C0] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-[#3A6AB6]/30"
                >
                  <WhatsAppIcon size={16} />
                  Talk to Us
                </Link>
                <Link
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  <Phone className="w-4 h-4" strokeWidth={2} />
                  {SITE.phone}
                </Link>
              </div>
            </div>

            {/* Right — proof stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROOF_POINTS.map((p) => (
                <div
                  key={p.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors duration-200"
                >
                  <p
                    className="text-[28px] font-bold text-white leading-none mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {p.value}
                  </p>
                  <p className="text-[12px] text-white/45 tracking-wide">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core USP items ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#3A6AB6] mb-3">
            Our Commitments
          </p>
          <h2
            className="text-[clamp(28px,3.5vw,42px)] font-bold text-[#1C1F26] leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What sets us <em className="not-italic text-[#3A6AB6]">apart</em>
          </h2>
        </div>

        {/* USP items — alternating layout */}
        <div className="flex flex-col gap-0 divide-y divide-slate-100">
          {USP_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`grid lg:grid-cols-2 gap-8 items-center py-14 ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Text side */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#3A6AB6]">
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className="text-[24px] md:text-[28px] font-bold text-[#1C1F26] leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </h3>
                <p className="text-[15px] text-slate-500 leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>

              {/* Visual side — decorative stat card */}
              <div
                className={`rounded-2xl p-8 flex items-center justify-center min-h-[160px] ${
                  i === 0
                    ? 'bg-[#EBF2FF]'
                    : i === 1
                    ? 'bg-[#1C1F26]'
                    : 'bg-slate-50'
                }`}
              >
                {i === 0 && (
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#3A6AB6] uppercase tracking-widest mb-2">
                      GST Registered
                    </p>
                    <p
                      className="text-[48px] font-bold text-[#1C1F26] leading-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      18%
                    </p>
                    <p className="text-[12px] text-slate-500 mt-1">
                      SAC Code 996411 — Compliant invoices on every trip
                    </p>
                  </div>
                )}
                {i === 1 && (
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#6B96D4] uppercase tracking-widest mb-2">
                      Average Confirmation
                    </p>
                    <p
                      className="text-[56px] font-bold text-white leading-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      &lt;15
                      <span className="text-[24px] text-[#6B96D4] ml-1">
                        min
                      </span>
                    </p>
                    <p className="text-[12px] text-white/45 mt-1">
                      WhatsApp reply · 7 days a week
                    </p>
                  </div>
                )}
                {i === 2 && (
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#3A6AB6] uppercase tracking-widest mb-2">
                      Hidden charges
                    </p>
                    <p
                      className="text-[64px] font-bold text-[#1C1F26] leading-none"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      ₹0
                    </p>
                    <p className="text-[12px] text-slate-500 mt-1">
                      Tolls, parking & driver allowance disclosed upfront
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards grid ───────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#3A6AB6] mb-3">
              Our Standards
            </p>
            <h2
              className="text-[clamp(26px,3vw,38px)] font-bold text-[#1C1F26]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Built for{' '}
              <em className="not-italic text-[#3A6AB6]">corporate India</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURE_CARDS.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-[#3A6AB6] hover:shadow-lg hover:shadow-[#3A6AB6]/8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF2FF] group-hover:bg-[#1C1F26] flex items-center justify-center text-2xl transition-colors duration-300 mb-4">
                  {card.icon}
                </div>
                <h3
                  className="text-[16px] font-bold text-[#1C1F26] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {card.title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#3A6AB6] mb-3">
            How We Compare
          </p>
          <h2
            className="text-[clamp(26px,3vw,38px)] font-bold text-[#1C1F26]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            YAANA Transit vs{' '}
            <em className="not-italic text-slate-400">typical providers</em>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_120px] bg-[#1C1F26] px-6 py-4">
            <span className="text-[12px] font-bold tracking-[1.5px] uppercase text-white/40">
              Feature
            </span>
            <span className="text-[13px] font-bold text-white text-center">
              YAANA Transit
            </span>
            <span className="text-[12px] font-bold text-white/40 text-center">
              Others
            </span>
          </div>

          {/* Table rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_120px_120px] items-center px-6 py-4 border-b border-slate-100 last:border-0 ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
              }`}
            >
              <span className="text-[14px] text-slate-700 pr-4">
                {row.feature}
              </span>
              <div className="flex justify-center">
                {row.yaana ? (
                  <CheckCircle2
                    className="w-5 h-5 text-[#3A6AB6]"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-slate-300 text-lg">
                    —
                  </span>
                )}
              </div>
              <div className="flex justify-center">
                {row.others ? (
                  <CheckCircle2
                    className="w-5 h-5 text-slate-300"
                    strokeWidth={2.5}
                  />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-slate-300 text-lg">
                    —
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WhatsApp highlight card ──────────────────────────────── */}
      <section className="bg-[#1C1F26] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-2xl px-8 py-10">
            <div className="flex items-start gap-5">
              <span className="text-4xl shrink-0">{HIGHLIGHT_CARD.icon}</span>
              <div>
                <h3
                  className="text-[22px] font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {HIGHLIGHT_CARD.title}
                </h3>
                <p className="text-[14px] text-white/55 leading-relaxed max-w-lg">
                  {HIGHLIGHT_CARD.description}
                </p>
              </div>
            </div>
            <Link
              href={buildWhatsAppUrl(
                'Hi YAANA Transit! I want to enquire about corporate transport services.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#3A6AB6] hover:bg-[#2560C0] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-[#3A6AB6]/30 shrink-0"
            >
              <WhatsAppIcon size={16} />
              Book on WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C1F26] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to simplify your corporate travel?
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-lg mx-auto">
            Join 500+ companies that trust YAANA Transit for their daily
            employee transport, executive rides, and event fleets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={buildWhatsAppUrl(
                'Hi YAANA Transit! I want to set up a corporate account for our company.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#1C1F26] hover:bg-[#3A6AB6] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A6AB6]/25 w-full sm:w-auto justify-center"
            >
              <WhatsAppIcon size={16} />
              Set Up Corporate Account
            </Link>
            <Link
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2.5 border border-slate-200 hover:border-[#1C1F26] text-slate-600 hover:text-[#1C1F26] font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {SITE.phone}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
