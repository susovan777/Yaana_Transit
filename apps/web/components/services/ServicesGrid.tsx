// Path: apps\web\components\services\ServicesGrid.tsx

'use client';

// Animated 3-column grid of service cards.
// "use client" because of whileInView + whileHover.
//
// Design reference: demo3.html .svc-card pattern —
// border highlight on hover with top blue line,
// icon bg shifts to navy, "Book now →" CTA.

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/lib/data/services';
import { buildWhatsAppUrl } from '@/lib/constants';

interface ServicesGridProps {
  services: Service[];
}

// Stagger the cards as they scroll into view
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
            className="group relative flex flex-col bg-white rounded-2xl border-[1.5px] border-slate-200 p-7 hover:border-[#3A6AB6] hover:shadow-xl hover:shadow-[#3A6AB6]/8 transition-shadow duration-300 overflow-hidden"
          >
            {/* Top accent line — slides in on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3A6AB6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#1C1F26] flex items-center justify-center text-2xl transition-colors duration-300 mb-5 shrink-0">
              {service.icon}
            </div>

            {/* Name */}
            <h3 className="font-poppins text-lg font-semibold text-[#1C1F26] mb-2">
              {service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
              {service.description}
            </p>

            {/* Footer: B2B — no pricing */}
            <div className="flex items-center justify-between pt-4 border-t border-line mt-auto">
              <span className="text-[12px] text-slate-400 italic">
                {/* Corporate pricing on request */}
              </span>

              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3A6AB6] hover:gap-2.5 transition-all duration-200 group/cta"
              >
                Enquire
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
