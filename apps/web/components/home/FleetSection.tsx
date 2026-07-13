// Path: components\home\FleetSection.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Cog, ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/constants';
import { WhatsAppIcon } from '../ui/SocialIcons';
import { FLEET, Car, CarCategory, BadgeStyle } from '@/lib/data/fleet';

// ─────────────────────────────────────────
// FILTER TABS
// ─────────────────────────────────────────
const TABS = [
  'All',
  'Sedan',
  'MUV',
  'SUV',
  'Premium SUV',
  'Premium',
  'Luxury',
] as const;
type Tab = (typeof TABS)[number];

const TAB_TO_CATEGORY: Record<Exclude<Tab, 'All'>, CarCategory> = {
  Sedan: 'sedan',
  MUV: 'muv',
  SUV: 'suv',
  'Premium SUV': 'premium-suv',
  Premium: 'premium',
  Luxury: 'luxury',
};

// Show one featured car per category on "All" tab
const FEATURED_IDS = ['maruti-dzire', 'innova-crysta', 'mercedes-e-class'];

function getFiltered(active: Tab): Car[] {
  if (active === 'All') return FLEET.filter((c) => FEATURED_IDS.includes(c.id));
  return FLEET.filter((c) => c.category === TAB_TO_CATEGORY[active]).slice(
    0,
    3
  );
}

// ─────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────
const BADGE_CLASSES: Record<BadgeStyle, string> = {
  blue: 'bg-sky-pale text-sky-brand',
  navy: 'bg-navy text-white',
  green: 'bg-emerald-50 text-emerald-600',
};

function CardBadge({ label, style }: { label: string; style: BadgeStyle }) {
  return (
    <span
      className={`
        absolute top-3 left-3 z-10
        text-[10px] font-bold tracking-[0.8px] uppercase
        px-2.5 py-1 rounded-full
        ${BADGE_CLASSES[style]}
      `}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────
// CAR CARD
// ─────────────────────────────────────────
function CarCard({ car }: { car: Car }) {
  const waMessage = `Hi! I want to enquire about the ${car.name}. Please share availability and pricing.`;
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <div className="group bg-white rounded-card border-[1.5px] border-line overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(11,31,58,0.1)] hover:border-sky-soft flex flex-col">
      {/* Image area */}
      <div className="relative h-[200px] bg-off-white overflow-hidden">
        {car.badge && car.badgeStyle && (
          <CardBadge label={car.badge} style={car.badgeStyle} />
        )}

        {/*
          Add car images to /public/images/cars/<id>.jpg
          e.g. /public/images/cars/maruti-swift.jpg
          Recommended: 600×400px, white/light background
        */}
        <Image
          src={`/images/cars/${car.id}.jpg`}
          alt={car.name}
          key={car.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Info area */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Name + type */}
        <div>
          <h3
            className="text-[20px] font-bold text-navy leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {car.name}
          </h3>
          <p className="text-[12px] text-muted uppercase tracking-[1px] mt-0.5">
            {car.typeLabel}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {car.seats} Seats
          </span>
          <span className="w-px h-3.5 bg-line" />
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            <Cog className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {car.transmission}
          </span>
          <span className="w-px h-3.5 bg-line" />
          <span className="text-[12px] text-muted">❄️ AC</span>
        </div>

        {/* Footer — B2B: no pricing, enquiry CTA only */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-line">
          <p className="text-[12px] text-muted italic">
            {/* Corporate pricing on request */}
          </p>

          {/* WhatsApp enquiry */}
          <Link
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-sky-pale text-sky-brand text-[12px] font-semibold transition-all duration-200 hover:bg-sky-brand hover:text-white"
          >
            <WhatsAppIcon size={15} />
            Enquire
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────
const headerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const headerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─────────────────────────────────────────
// CARD ANIMATION VARIANTS
// ─────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.25 },
  },
};

// ─────────────────────────────────────────
// FLEET SECTION
// ─────────────────────────────────────────
export default function FleetSection() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const filteredCars = getFiltered(activeTab);

  return (
    <section id="fleet" className="bg-white py-20 px-6 md:px-10 xl:px-14">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Header ── */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Left: title */}
          <div>
            <motion.div
              variants={headerItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full  bg-sky-pale border border-sky-soft text-[12px] font-semibold text-sky-brand tracking-[0.5px] mb-4"
            >
              🚗 Our Fleet
            </motion.div>

            <motion.h2
              variants={headerItem}
              className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vehicles for <em className="not-italic text-sky-brand">Every</em>{' '}
              Journey
            </motion.h2>

            <motion.p
              variants={headerItem}
              className="mt-3 text-[16px] leading-[1.75] text-muted max-w-[480px]"
            >
              Sedan to luxury — every vehicle is chauffeur-driven, fully
              insured, and available across 10+ cities.
            </motion.p>
          </div>

          {/* Right: filter tabs */}
          {/* <motion.div
            variants={headerItem}
            className="flex items-center gap-2 flex-wrap"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative px-5 py-2 rounded-full text-[13px] font-medium border transition-colors duration-200 cursor-pointer
                  ${
                    activeTab === tab
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-muted border-line hover:border-navy hover:text-navy'
                  }
                `}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="fleet-tab-active"
                    className="absolute inset-0 rounded-full bg-navy -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </motion.div> */}
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── View Full Fleet CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn bg-navy text-white text-[14px] font-semibold hover:bg-sky-brand transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-sky-brand/25"
          >
            View Full Fleet
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* ── Empty state ── */}
        <AnimatePresence>
          {filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-muted text-[15px]"
            >
              No vehicles in this category yet — check back soon.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
