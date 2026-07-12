// Path: components/home/ServicesSection.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
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
      className="group relative flex flex-col bg-white/4 border border-white/10 overflow-hidden transition-colors duration-300 hover:bg-white/6 hover:border-white/20 rounded-2xl"
    >
      {/* ── Image area ── */}
      <div className="relative h-[200px] overflow-hidden shrink-0">
        {/*
          Gradient fallback — visible before image loads or if image file is missing
        */}
        <div className="absolute inset-0 bg-[#1a2e4a]" />

        <Image
          src={`/images/services/${service.id}.jpg`}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bottom fade — blends image into card body */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 40%, rgba(11,18,32,0.85) 100%)',
          }}
        />

        {/* Icon pill — bottom-left of image */}
        {/* <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-[18px]">
            {service.icon}
          </span>
        </div> */}

        {/* Animated top accent line on hover */}
        <motion.span
          className="absolute top-0 left-0 h-[2px] w-full bg-[#3A6AB6] origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        <h3
          className="content-center text-[18px] font-bold text-white leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {service.name}
        </h3>

        <p className="text-[13px] leading-[1.75] text-white/50 flex-1">
          {service.description}
        </p>

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/8 mt-1">
          <span className="text-[11px] text-white/25 italic">
            Corporate pricing on request
          </span>

          <Link
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6B96D4] hover:text-white transition-colors duration-200 group/link"
          >
            Enquire
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
              strokeWidth={2.5}
            />
          </Link>
        </div>
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
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(58,106,182,0.25) 0%, transparent 65%)',
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3A6AB6]/20 border border-[#3A6AB6]/35 text-[12px] font-semibold text-[#6B96D4] tracking-[0.5px] mb-4"
          >
            ⚙️ What We Offer
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Every Kind of <em className="not-italic text-[#6B96D4]">Service</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[16px] leading-[1.75] text-white/55"
          >
            From daily employee transport to executive airport transfers — a
            dedicated corporate solution for every requirement.
          </motion.p>
        </motion.div>

        {/* ── Services grid ── */}
        <motion.div
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
