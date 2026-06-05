// Path: components\home\Hero.tsx

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl, SITE, WA_MESSAGES } from '@/lib/constants';

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const fadeUpContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.35,
    },
  },
};

const pulseDot = {
  animate: {
    opacity: [1, 0.4, 1],
    scale: [1, 0.82, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type StatItem = {
  value: string;
  suffix: string;
  label: string;
};

const STATS: StatItem[] = [
  { value: '50', suffix: '+', label: 'Cities Served' },
  { value: '200', suffix: '+', label: 'Vehicles' },
  { value: '4.9', suffix: '★', label: 'Customer Rating' },
  { value: '8', suffix: 'k+', label: 'Happy Travellers' },
];

// ─────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────
function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-brand/18 border border-sky-brand/35">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-[#7EB3FF]"
        animate={pulseDot.animate}
      />
      <span className="text-[12px] font-semibold text-[#7EB3FF] tracking-[0.5px]">
        Pan-India Car Rentals — 50+ Cities
      </span>
    </div>
  );
}

function HeroTagline() {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 h-px bg-sky-brand/60 shrink-0" />
      <span className="text-[14px] font-medium text-white/50 tracking-[3px] uppercase">
        {SITE.tagline}
      </span>
    </div>
  );
}

function HeroHeading() {
  return (
    <h1
      className="text-[clamp(40px,5vw,68px)] font-bold leading-[1.1] text-white"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      Your Journey, <em className="not-italic text-[#7EB3FF]">Our</em>{' '}
      Commitment
    </h1>
  );
}

function HeroStats() {
  return (
    <div className="flex flex-wrap items-start gap-8 pt-10 mt-10 border-t border-white/10">
      {STATS.map((stat, i) => (
        <motion.div key={stat.label} variants={fadeUpItem} custom={i}>
          <p
            className="text-[34px] font-bold leading-none text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {stat.value}
            <span className="text-sky-brand">{stat.suffix}</span>
          </p>
          <p className="mt-1 text-[12px] text-white/45 tracking-[0.5px]">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// WHATSAPP SVG ICON (inline — lucide has none)
// ─────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────
export default function HeroSection() {
  const waUrl = buildWhatsAppUrl(WA_MESSAGES.default);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col justify-center bg-navy"
    >
      {/* ── Background image ── */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        quality={90}
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* ── Gradient overlay
            Left side stays very dark for text legibility.
            Right side lightens slightly so the car image pops.
      ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(11,31,58,0.97) 0%, rgba(11,31,58,0.88) 45%, rgba(11,31,58,0.55) 100%)',
        }}
      />

      {/* ── Subtle dot pattern on overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Glow accents ── */}
      <div
        className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(46,111,216,0.28) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-16 left-10 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(46,111,216,0.15) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content grid ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-10 xl:px-14 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── LEFT: Text content ── */}
        <motion.div
          className="flex flex-col gap-5"
          variants={fadeUpContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpItem}>
            <HeroBadge />
          </motion.div>

          <motion.div variants={fadeUpItem}>
            <HeroTagline />
          </motion.div>

          <motion.div variants={fadeUpItem}>
            <HeroHeading />
          </motion.div>

          <motion.p
            className="text-[16px] leading-[1.8] text-white/60 max-w-[460px]"
            variants={fadeUpItem}
          >
            From airport pickups to cross-state road trips — Yana Transite
            delivers safe, comfortable, and reliable rides across India.
            Chauffeur-driven, self-drive &amp; corporate rentals.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            variants={fadeUpItem}
          >
            {/* Primary */}
            <a
              href="#fleet"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn bg-sky-brand text-white text-[14px] font-semibold transition-all duration-200 hover:bg-sky-dark hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(46,111,216,0.4)]"
            >
              Explore Fleet
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>

            {/* WhatsApp ghost */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-btn bg-white/8 border border-white/20 text-white text-[14px] font-medium transition-all duration-200 hover:bg-white/[0.14] hover:border-white/35"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUpItem}>
            <HeroStats />
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Car image ── */}
        <motion.div
          className="hidden lg:flex items-center justify-center"
          variants={fadeInRight}
          initial="hidden"
          animate="visible"
        >
          {/*
            Use a car PNG with a transparent / white background.
            A side-angle or 3/4-angle shot works best here.
            Ideal dimensions: 700×450px or wider.
          */}
          <div className="relative w-full max-w-[620px]">
            {/* Glow beneath the car */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-24 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(46,111,216,0.45) 0%, transparent 70%)',
                filter: 'blur(18px)',
              }}
            />

            <Image
              src="/images/hero-car.png"
              alt="Featured vehicle — Yana Transite"
              width={700}
              height={450}
              priority
              quality={90}
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] relative z-10"
            />
          </div>
        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-[11px] font-medium text-white/30 tracking-[2px] uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-linear-to-b from-white/30 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.4,
          }}
        />
      </motion.div>
    </section>
  );
}
