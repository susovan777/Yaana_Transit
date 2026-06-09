// Path: components\home\WhyUs.tsx

'use client';

import { motion } from 'framer-motion';

import { USP_ITEMS, FEATURE_CARDS, HIGHLIGHT_CARD } from '@/lib/data/why-us';

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

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
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
      {/* Icon box */}
      <div className="flex items-center justify-center w-9 h-9 rounded-btn bg-sky-pale shrink-0 text-[18px]">
        {icon}
      </div>

      <div>
        <p className="text-[15px] font-600 text-navy mb-1">{title}</p>
        <p className="text-[13px] leading-[1.65] text-muted">{description}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// FEATURE CARD — right 2×2 grid
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
      className="group bg-white rounded-card border-[1.5px] border-line p-6 hover:border-sky-soft hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(11,31,58,0.07)]"
    >
      <div className="text-[28px] mb-3">{icon}</div>
      <h4 className="text-[15px] font-semibold text-navy mb-1.5">{title}</h4>
      <p className="text-[13px] leading-[1.65] text-muted">{description}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// WHY US SECTION
// ─────────────────────────────────────────
export default function WhyUsSection() {
  return (
    <section id="why" className="bg-off-white py-24 px-6 md:px-10 xl:px-14">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
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
            🌟 Why Yana Transite
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
            We know what Indian travellers need. Transparent pricing, reliable
            drivers, and a team that picks up the phone at 2 AM.
          </motion.p>

          {/* USP list */}
          <div className="flex flex-col gap-6">
            {USP_ITEMS.map((item) => (
              <UspItem key={item.title} {...item} />
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Feature cards ── */}
        <motion.div
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-4"
        >
          {/* 2×2 card grid */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.id} {...card} />
            ))}
          </div>

          {/* Highlight card — full width, navy */}
          <motion.div
            variants={fadeUp}
            className="flex items-start gap-4 bg-navy rounded-card p-6"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-btn bg-sky-brand/20 shrink-0 text-[24px]">
              {HIGHLIGHT_CARD.icon}
            </div>

            <div>
              <h4 className="text-[15px] font-semibold text-white mb-1.5">
                {HIGHLIGHT_CARD.title}
              </h4>
              <p className="text-[13px] leading-[1.65] text-white/60">
                {HIGHLIGHT_CARD.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
