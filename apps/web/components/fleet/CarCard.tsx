// Path: apps/web/components/fleet/CarCard.tsx

'use client';

// Reusable car card — used on /fleet page grid.
//
// Props:
//   car      — Car object from lib/data/fleet.ts
//   priority — pass true for above-the-fold cards (LCP optimisation)

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Settings2 } from 'lucide-react';
import { WhatsAppIcon } from '../ui/SocialIcons';
import { buildWhatsAppUrl } from '@/lib/constants';
import { Car, BadgeStyle } from '@/lib/data/fleet';

// ── Badge colour map ────────────────────────────────────────────────
const badgeClasses: Record<BadgeStyle, string> = {
  blue: 'bg-[#EBF2FF] text-[#3A6AB6] border border-[#DDEAFF]',
  navy: 'bg-[#1C1F26] text-white',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

// ── Component ───────────────────────────────────────────────────────
interface CarCardProps {
  car: Car;
  priority?: boolean;
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const waUrl = buildWhatsAppUrl(
    `Hi YAANA Transit! I'm interested in the *${car.name}* (${car.typeLabel}). Could you share availability and corporate pricing?`
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5D9F5] transition-shadow duration-300"
    >
      {/* ── Car image ─────────────────────────────────────────── */}
      <div className="relative h-[200px] bg-[#F7F9FC] overflow-hidden">
        <Image
          src={`/images/cars/${car.id}.jpg`}
          alt={car.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle gradient — bottom only */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent pointer-events-none" />

        {/* Category badge */}
        {car.badge && car.badgeStyle && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold tracking-[0.8px] uppercase px-2.5 py-1 rounded-full ${
              badgeClasses[car.badgeStyle]
            }`}
          >
            {car.badge}
          </span>
        )}
      </div>

      {/* ── Card body ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name + type */}
        <div className="mb-3">
          <h3 className="text-[20px] font-bold text-[#1C1F26] leading-snug">
            {car.name}
          </h3>
          <p className="text-[11px] text-slate-500 uppercase tracking-[1px] mt-0.5">
            {car.typeLabel}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {car.seats} Seats
          </span>
          <span className="w-px h-3.5 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {car.transmission}
          </span>
          <span className="w-px h-3.5 bg-slate-200" />
          <span>❄️ AC</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Footer: B2B — no pricing, enquiry only ──────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <p className="text-[12px] text-slate-400 italic">
            {/* Corporate pricing on request */}
          </p>

          <Link
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#EBF2FF] text-[#3A6AB6] text-[12px] font-semibold transition-all duration-200 hover:bg-[#3A6AB6] hover:text-white"
          >
            <WhatsAppIcon size={15} />
            Enquire
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
