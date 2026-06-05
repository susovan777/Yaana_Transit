// Path: components\home\TrustStrip.tsx

'use client';

import { motion } from 'framer-motion';

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: '🛡️', label: 'Fully Insured Fleet' },
  { icon: '✅', label: 'Background-Verified Drivers' },
  { icon: '📞', label: '24/7 Customer Support' },
  { icon: '💳', label: 'UPI, Cards & Net Banking' },
  { icon: '🔁', label: 'Free Cancellation (24 hrs)' },
  { icon: '📱', label: 'WhatsApp Booking' },
] as const;

// ─────────────────────────────────────────
// TRUST STRIP
// ─────────────────────────────────────────
export default function TrustStrip() {
  return (
    <div className="bg-off-white border-y border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 xl:px-10 py-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4">
              {/* Trust item */}
              <motion.div
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: 'easeOut' }}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium text-muted whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>

              {/* Divider — hidden on last item and small screens */}
              {i < TRUST_ITEMS.length - 1 && (
                <span className="hidden xl:block w-px h-5 bg-line shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
