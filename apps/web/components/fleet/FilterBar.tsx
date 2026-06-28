// Path: apps/web/components/fleet/FilterBar.tsx

'use client';

// Category filter tabs for the Fleet page.
// Stateless — parent (CarGrid or fleet page) owns
// the active category state and passes it down.
//
// Props:
//   active    — currently selected category value
//   onChange  — called when user picks a new category

import { motion } from 'framer-motion';
import { FLEET_CATEGORIES, CarCategory } from '@/lib/data/fleet';

interface FilterBarProps {
  active: CarCategory | 'all';
  onChange: (value: CarCategory | 'all') => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter vehicles by category"
      className="flex items-center gap-2 flex-wrap"
    >
      {FLEET_CATEGORIES.map((cat) => {
        const isActive = active === cat.value;

        return (
          <button
            key={cat.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.value as CarCategory | 'all')}
            className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#3A6AB6] focus-visible:ring-offset-2"
          >
            {/* Animated active pill — slides under the text */}
            {isActive && (
              <motion.span
                layoutId="fleet-filter-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="absolute inset-0 rounded-full bg-[#1C1F26]"
              />
            )}

            {/* Label — sits above the animated pill */}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-[#1C1F26]'
              }`}
            >
              {cat.label}
            </span>

            {/* Inactive border */}
            {!isActive && (
              <span className="absolute inset-0 rounded-full border border-slate-200 hover:border-slate-400 transition-colors duration-200" />
            )}
          </button>
        );
      })}
    </div>
  );
}
