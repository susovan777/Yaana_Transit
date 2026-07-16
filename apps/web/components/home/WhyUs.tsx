// Path: components/home/WhyUs.tsx

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import { USP_ITEMS, FEATURE_CARDS } from '@/lib/data/why-us';
// HIGHLIGHT_CARD commented out as per client request
// import { HIGHLIGHT_CARD } from '@/lib/data/why-us';

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const stagger = (delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: delay },
  },
});

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─────────────────────────────────────────
// USP ITEM — left column bullet
// ─────────────────────────────────────────
function UspItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeLeft} className="flex items-start gap-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-btn bg-sky-pale shrink-0 text-[18px]">
        {icon}
      </div>
      <div>
        <p className="text-[15px] font-semibold text-navy mb-1">{title}</p>
        <p className="text-[13px] leading-[1.65] text-muted">{description}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// FEATURE CARD — 2×2 grid below image
// ─────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white rounded-card border-[1.5px] border-line p-5 hover:border-sky-soft hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(11,31,58,0.07)] transition-all duration-200"
    >
      <div className="text-[24px] mb-2.5">{icon}</div>
      <h4 className="text-[14px] font-semibold text-navy mb-1">{title}</h4>
      <p className="text-[12px] leading-[1.65] text-muted">{description}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// WHY US SECTION
// ─────────────────────────────────────────
export default function WhyUsSection() {
  return (
    <section id="why" className="bg-off-white py-24 px-6 md:px-10 xl:px-14">
      

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 md:gap-y-10 items-center">
  {/* ── LEFT: Text content ── */}
  <motion.div
    variants={stagger(0)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
  >
    {/* Pill */}
    <motion.div
      variants={fadeLeft}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-pale border border-sky-soft text-[12px] font-semibold text-sky-brand tracking-[0.5px] mb-4"
    >
      🌟 Why YAANA Transit
    </motion.div>

    {/* Heading */}
    <motion.h2
      variants={fadeLeft}
      className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-navy mb-4"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      Driven by <em className="not-italic text-sky-brand">Trust,</em>
      <br />
      Built for India
    </motion.h2>

    {/* Description */}
    <motion.p
      variants={fadeLeft}
      className="text-[16px] leading-[1.75] text-muted mb-10 max-w-[480px]"
    >
      We know what corporate India needs — professional chauffeurs,
      transparent billing, and a team that responds in minutes, not hours.
    </motion.p>

    {/* USP list */}
    <div className="flex flex-col gap-6">
      {USP_ITEMS.map((item) => (
        <UspItem key={item.title} {...item} />
      ))}
    </div>
  </motion.div>

  {/* ── RIGHT: Chauffeur image + feature cards ── */}
  <motion.div
    variants={stagger(0.15)}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    className="flex flex-col gap-4"
  >
    {/* ── Chauffeur photo ── */}
    <motion.div
      variants={fadeUp}
      className="relative w-full overflow-hidden rounded-2xl shadow-lg"
      style={{ aspectRatio: '4 / 3' }}
    >
      <Image
        src="/images/chauffeurs.png"
        alt="YAANA Transit — Professional uniformed chauffeurs"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center"
      />

      {/* Subtle bottom gradient so cards below don't clash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 60%, rgba(247,249,252,0.4) 100%)',
        }}
      />

      {/* "Our Chauffeurs" badge — bottom-left */}
      <div className="absolute bottom-4 left-4">
        <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-sky-brand shrink-0" />
          <span className="text-[12px] font-semibold text-navy tracking-[0.3px]">
            Verified YAANA Chauffeurs
          </span>
        </span>
      </div>
    </motion.div>
  </motion.div>

  {/* ── 1×4 feature cards — full width horizontal ── */}
  {/* Added col-span-full to stretch across both lg:grid-cols-2 columns */}
  <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-3 lg:mt-6">
    {FEATURE_CARDS.map((card) => (
      <FeatureCard key={card.id} {...card} />
    ))}
  </div>
</div>
    </section>
  );
}
