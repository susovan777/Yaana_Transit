// Path: components\home\ServiceSection.jsx

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { buildWhatsAppUrl } from '@/lib/constants';
import { SERVICES, Service } from '@/lib/data/services';

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const sectionHeader = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────
function ServiceCard({ service }: { service: Service }) {
  const waUrl = buildWhatsAppUrl(service.waMessage);

  return (
    <motion.div
      variants={cardFadeUp}
      className="group relative flex flex-col gap-5 p-8 md:p-10 bg-white/4 border border-white/8 overflow-hidden transition-colors duration-300 hover:bg-sky-brand/8"
    >
      {/* Animated top-border on hover */}
      <motion.span
        className="absolute top-0 left-0 h-[2px] w-full bg-sky-brand origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-[14px] bg-sky-brand/20 text-[26px] shrink-0 transition-transform duration-300 group-hover:scale-110">
        {service.icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 flex-1">
        <h3
          className="text-[20px] font-bold text-white leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {service.name}
        </h3>
        <p className="text-[14px] leading-[1.75] text-white/50">
          {service.description}
        </p>
      </div>

      {/* Footer: price + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-white/8">
        <span className="text-[13px] font-semibold text-[#7EB3FF]">
          {service.priceLabel}
        </span>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/50 hover:text-white transition-colors duration-200 group/link"
        >
          Enquire
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
            strokeWidth={2.5}
          />
        </a>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────
export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-navy py-24 px-6 md:px-10 xl:px-14 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(46,111,216,0.25) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* ── Section header ── */}
        <motion.div
          className="max-w-[540px] mb-14"
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-brand/20 border border-sky-brand/35 text-[12px] font-semibold text-[#7EB3FF] tracking-[0.5px] mb-4"
          >
            ⚙️ What We Offer
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Every Kind of <em className="not-italic text-[#7EB3FF]">Ride</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[16px] leading-[1.75] text-white/55"
          >
            Whether it's a daily commute, airport run, family trip or corporate
            travel — we've got a service built for it.
          </motion.p>
        </motion.div>

        {/* ── Services grid ── */}
        <motion.div
          className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
