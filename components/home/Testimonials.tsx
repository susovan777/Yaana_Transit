// Path: components\home\Testimonials.tsx

'use client';

import { motion } from 'framer-motion';
import { TESTIMONIALS, Testimonial } from '@/lib/data/testimonials';

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
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─────────────────────────────────────────
// STAR ROW
// ─────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? '#F59E0B' : 'none'}
          stroke={i < count ? '#F59E0B' : '#D1D5DB'}
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONIAL CARD
// ─────────────────────────────────────────
function TestimonialCard({ testi }: { testi: Testimonial }) {
  return (
    <motion.div
      variants={cardVariants}
      className="group flex flex-col gap-5 bg-white rounded-card border-[1.5px] border-[#D0E4FF] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(46,111,216,0.1)]"
    >
      {/* Opening quote */}
      <span
        className="text-[40px] leading-none text-sky-brand select-none"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Stars */}
      <Stars count={testi.rating} />

      {/* Review text */}
      <p
        className="text-[17px] italic leading-[1.7] text-navy flex-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {testi.text}
      </p>

      {/* Divider */}
      <div className="h-px bg-line" />

      {/* Reviewer */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 text-white text-[16px] font-bold ${testi.avatarBg}`}
        >
          {testi.initial}
        </div>

        <div>
          <p className="text-[14px] font-semibold text-navy">{testi.name}</p>
          <p className="text-[12px] text-muted mt-0.5">
            {testi.city} · {testi.service}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// TESTIMONIALS SECTION
// ─────────────────────────────────────────
export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-sky-pale py-24 px-6 md:px-10 xl:px-14"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* ── Section header ── */}
        <motion.div
          className="text-center mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-sky-soft text-[12px] font-semibold text-sky-brand tracking-[0.5px] mb-4"
          >
            💬 Customer Reviews
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.12] text-navy"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What Our <em className="not-italic text-sky-brand">Travellers</em>{' '}
            Say
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-[16px] leading-[1.75] text-muted max-w-[440px] mx-auto"
          >
            Real experiences from customers across India.
          </motion.p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {TESTIMONIALS.map((testi) => (
            <TestimonialCard key={testi.id} testi={testi} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
