// Path: apps/web/components/services/ServicesGrid.tsx

'use client';

// Animated 3-column grid of service cards for /services page.
// "use client" — needed for whileInView + whileHover.

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/lib/data/services';
import { buildWhatsAppUrl } from '@/lib/constants';

interface ServicesGridProps {
  services: Service[];
}

// ── Animation variants ────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Component ────────────────────────────────────────────────────────
export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {services.map((service) => {
        const waUrl = buildWhatsAppUrl(service.waMessage);

        return (
          <motion.div
            key={service.id}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5D9F5] transition-shadow duration-300"
          >
            {/* ── Image area ─────────────────────────────────────── */}
            <div className="relative h-[210px] overflow-hidden shrink-0 bg-slate-100">
              <Image
                src={`/images/services/${service.id}.jpg`}
                alt={service.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Bottom gradient — softens image-to-card-body transition */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.15) 100%)',
                }}
              />

              {/* Top accent line — slides in on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3A6AB6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              {/* Icon badge — bottom-left corner of image */}
              {/* <div className="absolute bottom-3 left-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm text-[20px]">
                  {service.icon}
                </span>
              </div> */}
            </div>

            {/* ── Card body ───────────────────────────────────────── */}
            <div className="flex flex-col flex-1 p-6">
              {/* Name */}
              <h3
                className="text-[18px] font-bold text-[#1C1F26] mb-2 leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-slate-500 leading-relaxed flex-1 mb-5">
                {service.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 italic">
                  Corporate pricing on request
                </span>

                <Link
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#3A6AB6] hover:gap-1.5 transition-all duration-200 group/cta"
                >
                  Enquire
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
