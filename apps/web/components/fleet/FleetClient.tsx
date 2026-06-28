// Path: apps\web\components\fleet\FleetClient.tsx

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, CarCategory } from '@/lib/data/fleet';
import CarGrid from '@/components/fleet/CarGrid';
import FilterBar from './FilterBar';

interface FleetClientProps {
  cars: Car[];
}

export default function FleetClient({ cars }: FleetClientProps) {
  const [active, setActive] = useState<CarCategory | 'all'>('all');

  // Memoised so we don't re-filter on every render
  const filtered = useMemo(
    () => (active === 'all' ? cars : cars.filter((c) => c.category === active)),
    [active, cars]
  );

  return (
    <div>
      {/* ── Filter bar + result count ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <FilterBar active={active} onChange={setActive} />

        <motion.p
          key={filtered.length}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-slate-400 shrink-0"
        >
          {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}
          {active !== 'all' && (
            <button
              onClick={() => setActive('all')}
              className="ml-2 text-[#3A6AB6] hover:underline font-medium"
            >
              Clear filter
            </button>
          )}
        </motion.p>
      </div>

      {/* ── Car grid ─────────────────────────────────────────── */}
      <CarGrid cars={filtered} />
    </div>
  );
}
