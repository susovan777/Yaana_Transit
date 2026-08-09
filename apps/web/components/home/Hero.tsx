// Path: components\home\Hero.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '../ui/SocialIcons';
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
        className="w-1.5 h-1.5 rounded-full bg-[#6B96D4]"
        animate={pulseDot.animate}
      />
      <span className="text-[12px] font-semibold text-[#6B96D4] tracking-[0.5px]">
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
      Your Journey, <em className="not-italic text-[#6B96D4]">Our</em>{' '}
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
        src="/images/cars/car-bg.png"
        alt=""
        fill
        priority
        quality={75}
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
            'linear-gradient(105deg, rgba(11,31,58,0.97) 0%,  rgba(11,31,58,0.55) 100%)',
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
            From airport pickups to cross-state road trips — YAANA Transite
            delivers safe, comfortable, and reliable rides across India.
            Chauffeur-driven, self-drive &amp; corporate rentals.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            variants={fadeUpItem}
          >
            {/* Primary */}
            <Link
              href="#fleet"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn bg-sky-brand text-white text-[14px] font-semibold transition-all duration-200 hover:bg-sky-dark hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(46,111,216,0.4)]"
            >
              Explore Fleet
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>

            {/* WhatsApp ghost */}
            <Link
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-btn bg-white/8 border border-white/20 text-white text-[14px] font-medium transition-all duration-200 hover:bg-wa-green hover:text-black"
            >
              <WhatsAppIcon size={18} />
              WhatsApp Us
            </Link>
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
            {/* <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-24 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(46,111,216,0.45) 0%, transparent 70%)',
                filter: 'blur(18px)',
              }}
            /> */}

            {/* <Image
              src="/images/hero-car.png"
              alt="Featured vehicle — YAANA Transite"
              width={700}
              height={450}
              priority
              quality={75}
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] relative z-10"
            /> */}
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
