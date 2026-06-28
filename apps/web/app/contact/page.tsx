// Path: apps/web/app/contact/page.tsx

// Contact page — /contact
//
// Architecture: Server Component wrapper.
// EnquiryForm is the only client component
// (needs form state + WhatsApp submission).
// Everything else is static — server-rendered for SEO.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { SITE, buildWhatsAppUrl } from '@/lib/constants';
import { OFFICES } from '@/lib/data/cities';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import EnquiryForm from '@/components/contact/EnquiryForm';

// ── SEO metadata ──────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `Contact Us — ${SITE.name}`,
  description:
    'Get in touch with YAANA Transit for corporate car rental enquiries. Head office in Bengaluru with branches across Delhi, Mumbai, Pune, Hyderabad and Chennai.',
  openGraph: {
    title: `Contact Us — ${SITE.name}`,
    description:
      'One call or WhatsApp message — our team responds within 15 minutes.',
    url: '/contact',
  },
};

// ── Contact methods ───────────────────────────────────────────────────
const CONTACT_METHODS = [
  {
    icon: <Phone className="w-5 h-5" strokeWidth={2} />,
    label: 'Call Us',
    value: SITE.phone,
    sub: 'Mon – Sat, 6 AM – 11 PM',
    href: `tel:${SITE.phone}`,
    bg: 'bg-[#EBF2FF]',
    color: 'text-[#3A6AB6]',
  },
  {
    icon: <MessageCircle className="w-5 h-5" strokeWidth={2} />,
    label: 'WhatsApp',
    value: 'Chat with us',
    sub: 'Reply within 15 minutes',
    href: buildWhatsAppUrl(
      'Hi YAANA Transit! I have a corporate transport enquiry.'
    ),
    bg: 'bg-[#E8F8EF]',
    color: 'text-[#16A34A]',
    external: true,
  },
  {
    icon: <Mail className="w-5 h-5" strokeWidth={2} />,
    label: 'Email',
    value: SITE.email,
    sub: 'We reply within 4 hours',
    href: `mailto:${SITE.email}`,
    bg: 'bg-slate-100',
    color: 'text-slate-600',
  },
  {
    icon: <Clock className="w-5 h-5" strokeWidth={2} />,
    label: 'Working Hours',
    value: '6 AM – 11 PM',
    sub: 'All 7 days of the week',
    href: null,
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
];

// ── Page ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  const headOffice = OFFICES.find((o) => o.type === 'head');
  const branchOffices = OFFICES.filter((o) => o.type === 'branch');

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
        <div className="absolute top-[-80px] right-[-80px] w-[560px] h-[560px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(46,111,216,0.28)_0%,transparent_70%)]" />

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
              <li className="text-white/60">Contact</li>
            </ol>
          </nav>

          {/* Two-col: headline left, form right */}
          <div className="grid lg:grid-cols-[1fr_480px] gap-14 items-start">
            {/* Left — headline + contact methods */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[#6B96D4] text-xs font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B96D4] animate-pulse" />
                Get in Touch
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Let's talk{' '}
                <em className="not-italic text-[#6B96D4]">corporate travel</em>
              </h1>

              <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Tell us your requirement — fleet size, cities, travel frequency.
                Our corporate team will respond within 15 minutes with a
                tailored solution.
              </p>

              {/* Contact method cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTACT_METHODS.map((method) => {
                  const inner = (
                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 transition-colors duration-200">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method.bg} ${method.color}`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/40 mb-0.5">
                          {method.label}
                        </p>
                        <p className="text-[15px] font-semibold text-white">
                          {method.value}
                        </p>
                        <p className="text-[12px] text-white/40 mt-0.5">
                          {method.sub}
                        </p>
                      </div>
                    </div>
                  );

                  return method.href ? (
                    <Link
                      key={method.label}
                      href={method.href}
                      target={method.external ? '_blank' : undefined}
                      rel={method.external ? 'noopener noreferrer' : undefined}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={method.label}>{inner}</div>
                  );
                })}
              </div>
            </div>

            {/* Right — enquiry form (client component) */}
            <div className="lg:sticky lg:top-24">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Office locations ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <MapPin className="w-4 h-4 text-[#3A6AB6] shrink-0" strokeWidth={2} />
          <h2 className="text-[13px] font-bold tracking-[2px] uppercase text-slate-400">
            Our Offices
          </h2>
        </div>

        {/* Head office — wide featured card */}
        {headOffice && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#1C1F26] rounded-2xl px-8 py-8 mb-5">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#3A6AB6]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#6B96D4]" strokeWidth={2} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <span
                    className="text-[20px] font-bold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {headOffice.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3A6AB6] text-white text-[10px] font-bold tracking-[0.8px] uppercase">
                    ★ Head Office
                  </span>
                </div>
                <p className="text-[14px] text-white/50">
                  {headOffice.state} — Primary operations &amp; corporate
                  accounts hub
                </p>
                <p className="text-[13px] text-white/35 mt-1 italic">
                  Full address will be updated shortly
                </p>
              </div>
            </div>

            <Link
              href={buildWhatsAppUrl(
                `Hi YAANA Transit! I want to reach your ${headOffice.name} office.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3A6AB6] hover:bg-[#2560C0] text-white text-[13px] font-semibold transition-all duration-200 hover:-translate-y-px shrink-0"
            >
              <WhatsAppIcon size={14} />
              WhatsApp HQ
            </Link>
          </div>
        )}

        {/* Branch offices — grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchOffices.map((office) => (
            <div
              key={office.cityId}
              className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#C5D9F5] hover:bg-[#EBF2FF]/30 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#3A6AB6]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p
                    className="text-[15px] font-bold text-[#1C1F26]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {office.name}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EBF2FF] text-[#3A6AB6] text-[10px] font-bold tracking-[0.6px] uppercase border border-[#DDEAFF]">
                    Branch
                  </span>
                </div>
                <p className="text-[12px] text-slate-500">{office.state}</p>
                <Link
                  href={buildWhatsAppUrl(
                    `Hi YAANA Transit! I need corporate transport in ${office.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2.5 text-[12px] font-semibold text-[#3A6AB6] hover:text-[#1C1F26] transition-colors duration-200"
                >
                  <WhatsAppIcon size={12} />
                  Enquire for {office.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ strip ────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-[22px] font-bold text-[#1C1F26] mb-8 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Common Questions
          </h2>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'How quickly do you respond to enquiries?',
                a: 'Our corporate team responds via WhatsApp within 15 minutes during working hours (6 AM – 11 PM, all days).',
              },
              {
                q: 'Do you provide GST-compliant invoices?',
                a: 'Yes — every booking comes with a GST invoice (SAC Code 996411). Corporate accounts can download invoices anytime.',
              },
              {
                q: 'Can we set up a monthly corporate account?',
                a: 'Absolutely. We offer monthly billing, dedicated account managers, and multi-city contracts for corporate clients. WhatsApp us to set this up.',
              },
              {
                q: 'Is pricing available on the website?',
                a: 'We operate exclusively in the B2B segment, so pricing is customised per client based on fleet size, cities, and usage. Contact us for a tailored quote.',
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <p className="text-[14px] font-semibold text-[#1C1F26] mb-2">
                  {item.q}
                </p>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
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
            Prefer to just call?
          </h2>
          <p className="text-slate-500 text-base mb-8">
            Our team is available 6 AM – 11 PM, all days. No hold music, no bots
            — a real person picks up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2.5 bg-[#1C1F26] hover:bg-[#3A6AB6] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A6AB6]/25 w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {SITE.phone}
            </Link>
            <Link
              href={buildWhatsAppUrl(
                'Hi YAANA Transit! I have a corporate transport enquiry.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-slate-200 hover:border-[#1C1F26] text-slate-600 hover:text-[#1C1F26] font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <WhatsAppIcon size={16} />
              WhatsApp Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
