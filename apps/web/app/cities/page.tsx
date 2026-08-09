// Path: apps\web\app\cities\page.tsx

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { CITIES, OFFICES } from '@/lib/data/cities';
import { SITE, buildWhatsAppUrl } from '@/lib/constants';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

// ── SEO metadata ─────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Our Locations — ${SITE.name}`,
  description:
    'YAANA Transit operates across 50+ cities in India. Head office in Bengaluru with branch offices in Delhi, Pune, Hyderabad, Mumbai and Chennai.',
  openGraph: {
    title: `Our Locations — ${SITE.name}`,
    description:
      'Corporate car rental across India — one point of contact, every city.',
    url: '/cities',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────
function getOfficeType(cityId: string) {
  return OFFICES.find((o) => o.cityId === cityId)?.type ?? null;
}

// ── Office badge ─────────────────────────────────────────────────────
function OfficeBadge({ type }: { type: 'head' | 'branch' }) {
  return type === 'head' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-brand text-white text-[10px] font-bold tracking-[0.8px] uppercase">
      ★ Head Office
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF2FF] text-sky-brand text-[10px] font-bold tracking-[0.8px] uppercase border border-[#DDEAFF]">
      Branch Office
    </span>
  );
}

// ── City card — used in the main grid ────────────────────────────────
function CityCard({
  city,
  officeType,
}: {
  city: (typeof CITIES)[number];
  officeType: 'head' | 'branch' | null;
}) {
  const waUrl = buildWhatsAppUrl(
    `Hi YAANA Transit! I need corporate transport services in ${city.name}. Please share details.`
  );

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5D9F5] transition-all duration-300 hover:-translate-y-1">
      {/* Photo */}
      <div className="relative h-[200px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: city.gradient }}
        />
        <Image
          src={`/images/cities/${city.id}.jpg`}
          alt={`${city.name} — YAANA Transit`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(11,31,58,0.6) 0%, transparent 60%)',
          }}
        />
        {/* City name on image */}
        <div className="absolute bottom-0 left-0 p-4">
          <p
            className="text-[20px] font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {city.name}
          </p>
          <p className="text-[12px] text-white/70 mt-0.5">{city.state}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Office badge */}
        {officeType && (
          <div>
            <OfficeBadge type={officeType} />
          </div>
        )}

        {/* Description based on office type */}
        <p className="text-[13px] text-slate-500 leading-relaxed">
          {officeType === 'head'
            ? `Our headquarters city. Full-service operations with dedicated fleet management, account handling, and 24/7 chauffeur dispatch.`
            : `Branch office serving ${city.name} and surrounding regions. Chauffeur-driven and corporate fleet available for immediate deployment.`}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <Link
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#EBF2FF] text-sky-brand text-[12px] font-semibold hover:bg-sky-brand hover:text-white transition-all duration-200"
          >
            <WhatsAppIcon size={14} />
            Enquire for {city.name}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────
const STATS = [
  { value: '6', label: 'Office locations' },
  { value: '50+', label: 'Cities served' },
  { value: '1', label: 'Head office' },
  { value: '5', label: 'Branch offices' },
];

// ── Other cities (non-office) ─────────────────────────────────────────
const OTHER_CITIES = [
  'Ahmedabad',
  'Kochi',
  'Chandigarh',
  'Agra',
  'Udaipur',
  'Coimbatore',
  'Nagpur',
  'Surat',
  'Vadodara',
  'Vizag',
  'Bhopal',
  'Indore',
  'Lucknow',
  'Jaipur',
  'Amritsar',
  'Mysuru',
  'Mangaluru',
  'Thiruvananthapuram',
  'Patna',
  'Guwahati',
];

// ── Page ──────────────────────────────────────────────────────────────
export default function CitiesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
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
              <li className="text-white/60">Our Locations</li>
            </ol>
          </nav>

          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[#6B96D4] text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B96D4] animate-pulse" />
            Our Presence
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            One Partner,{' '}
            <em className="not-italic text-[#6B96D4]">Every City</em>
          </h1>

          <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl mb-10">
            A single corporate account gives your team access to
            chauffeur-driven fleets across all our locations — one rate card,
            one point of contact, zero coordination overhead.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p
                  className="text-3xl font-bold text-white leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
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

      {/* ── Office locations grid ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-4 h-4 text-sky-brand shrink-0" strokeWidth={2} />
          <h2 className="text-[13px] font-bold tracking-[2px] uppercase text-slate-400">
            Office Locations
          </h2>
        </div>

        {/* Head office — Bengaluru — featured full-width card */}
        {(() => {
          const headCity = CITIES.find((c) => getOfficeType(c.id) === 'head');
          if (!headCity) return null;
          return (
            <div className="mb-6">
              <div className="group relative flex flex-col lg:flex-row bg-[#1C1F26] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Image — takes 40% width on desktop */}
                <div className="relative h-[220px] lg:h-auto lg:w-[40%] shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ background: headCity.gradient }}
                  />
                  <Image
                    src={`/images/cities/${headCity.id}.jpg`}
                    alt={headCity.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="text-[28px] font-bold text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {headCity.name}
                    </span>
                    <OfficeBadge type="head" />
                  </div>

                  <p className="text-[15px] text-white/60 leading-relaxed max-w-lg">
                    Our headquarters and primary operations hub. Full-service
                    fleet management, corporate account handling, chauffeur
                    training centre, and 24/7 dispatch — all coordinated from
                    Bengaluru.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href={buildWhatsAppUrl(
                        `Hi YAANA Transit! I need corporate transport in Bengaluru.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-brand text-white text-[13px] font-semibold hover:bg-[#2560C0] transition-colors duration-200"
                    >
                      <WhatsAppIcon size={15} />
                      Enquire for Bengaluru
                    </Link>
                    <Link
                      href={`tel:${SITE.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-[13px] font-semibold transition-colors duration-200"
                    >
                      <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                      {SITE.phone}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Branch offices — 5-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CITIES.filter((c) => getOfficeType(c.id) === 'branch').map(
            (city) => (
              <CityCard key={city.id} city={city} officeType="branch" />
            )
          )}
        </div>
      </section>

      {/* ── Other cities ─────────────────────────────────────────── */}
      {/* <section className="bg-slate-50 border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MapPin
              className="w-4 h-4 text-slate-400 shrink-0"
              strokeWidth={2}
            />
            <h2 className="text-[13px] font-bold tracking-[2px] uppercase text-slate-400">
              Also Serving
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {OTHER_CITIES.map((city) => (
              <span
                key={city}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium text-slate-600"
              >
                {city}
              </span>
            ))}
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[13px] font-medium text-slate-400 italic">
              + 30 more on request
            </span>
          </div>
        </div>
      </section> */}

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C1F26] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Need service in a city not listed?
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-lg mx-auto">
            We cover 50+ cities and can arrange corporate transport on request
            across India. Contact us with your requirement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={buildWhatsAppUrl(
                'Hi YAANA Transit! I need corporate transport in a city not listed on your website.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-wa-green hover:bg-[#3A6AB6] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A6AB6]/25 w-full sm:w-auto justify-center"
            >
              <WhatsAppIcon size={16} />
              Chat on WhatsApp
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
