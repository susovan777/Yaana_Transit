// Path: components\home\Cities.tsx

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import { CITIES, City } from '@/lib/data/cities';

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const headerVariants = {
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

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─────────────────────────────────────────
// CITY CARD
// ─────────────────────────────────────────
function CityCard({
  city,
  className = '',
}: {
  city: City;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-card cursor-pointer ${className}`}
    >
      {/* Gradient fallback — visible before image loads */}
      <div className="absolute inset-0" style={{ background: city.gradient }} />

      {/*
        City photo — add to /public/images/cities/<id>.jpg
        Recommended: landscape shot, 800×600px minimum.
        The gradient above shows as fallback if photo is missing.
      */}
      <Image
        src={`/images/cities/${city.id}.jpg`}
        alt={`Car rental in ${city.name}`}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark gradient overlay — bottom-up so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, transparent 25%, rgba(11,31,58,0.82) 100%)',
        }}
      />

      {/* City label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <p
          className="text-[22px] font-bold text-white leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {city.name}
        </p>

        <p className="text-[12px] text-white/65 mt-0.5 tracking-[0.4px]">
          {city.state}
        </p>

        {/* Car count pill */}
        <span className="inline-block mt-2.5 px-2.5 py-1 rounded-full bg-sky-brand/80 text-white text-[11px] font-semibold tracking-[0.3px]">
          {city.carCount}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// CITIES SECTION
// ─────────────────────────────────────────
export default function CitiesSection() {
  const [featured, ...rest] = CITIES;

  return (
    <section id="cities" className="bg-white py-24 px-6 md:px-10 xl:px-14">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-pale border border-sky-soft text-[12px] font-semibold text-sky-brand tracking-[0.5px] mb-4"
          >
            📍 Our Presence
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-navy"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            We Operate Across{' '}
            <em className="not-italic text-sky-brand">India</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[16px] leading-[1.75] text-muted max-w-[480px] mx-auto"
          >
            From the beaches of Goa to the forts of Rajasthan — find a Yana
            Transite car in your city.
          </motion.p>
        </motion.div>

        {/* ── Bento grid ──
              Desktop  : 4 columns, auto rows of 220px
                         Mumbai → col-span-2, row-span-2
                         Others → 1×1
              Mobile   : 2 columns, auto rows of 180px
                         Mumbai → col-span-2 (full width), row-span-1
        ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] lg:auto-rows-[220px] gap-3 lg:gap-3.5"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Mumbai — large feature card */}
          <CityCard
            city={featured}
            className="col-span-2 row-span-1 lg:row-span-2"
          />

          {/* Remaining cities */}
          {rest.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
