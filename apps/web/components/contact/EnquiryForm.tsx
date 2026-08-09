// Path: apps/web/components/contact/EnquiryForm.tsx

'use client';

// Enquiry form — client component because of form state.
// On submit: builds a pre-filled WhatsApp message and
// opens it in a new tab. No backend needed at this stage.
// When the API is ready, swap handleSubmit to POST /enquiries.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/constants';

type FormData = {
  company: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
};

const INITIAL: FormData = {
  company: '',
  name: '',
  phone: '',
  email: '',
  city: '',
  service: '',
  message: '',
};

const SERVICE_OPTIONS = [
  'Chauffeur-Driven',
  'Employee Transportation (ETS)',
  'Airport Transfers',
  'Outstation Trips',
  'Corporate Rental / Leasing',
  'Events & Occasions',
  'Other',
];

const CITY_OPTIONS = [
  'Bengaluru',
  'New Delhi',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Other city',
];

// ── Field wrapper ─────────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#1C1F26] tracking-[0.3px]">
        {label}
        {required && <span className="text-[#3A6AB6] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ── Shared input classes ──────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] text-[#1C1F26] placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#3A6AB6] focus:ring-3 focus:ring-[#3A6AB6]/10 hover:border-slate-300';

// ── Component ────────────────────────────────────────────────────────
export default function EnquiryForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const set =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Build WhatsApp message from form data
    const lines = [
      `Hi YAANA Transit! I'd like to submit a corporate enquiry.`,
      ``,
      `🏢 Company: ${form.company}`,
      `👤 Contact: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `✉️ Email: ${form.email}`,
      `📍 City: ${form.city}`,
      `🚗 Service required: ${form.service}`,
      form.message ? `📝 Message: ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `${SITE.whatsappBase}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
  }

  function handleReset() {
    setForm(INITIAL);
    setSubmitted(false);
  }

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="bg-[#1C1F26] px-7 py-5">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B96D4] mb-1">
          Corporate Enquiry
        </p>
        <h3
          className="text-[20px] font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Get a Custom Quote
        </h3>
        <p className="text-[13px] text-white/50 mt-1">
          We respond within 15 minutes on WhatsApp.
        </p>
      </div>

      {/* Form body */}
      <div className="px-7 py-7">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-4 py-10 text-center"
            >
              <CheckCircle2
                className="w-12 h-12 text-[#3A6AB6]"
                strokeWidth={1.5}
              />
              <div>
                <p
                  className="text-[18px] font-bold text-[#1C1F26] mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  WhatsApp opened!
                </p>
                <p className="text-[13px] text-slate-500 max-w-[260px]">
                  Your enquiry details are pre-filled. Just hit send and our
                  team will reply within 15 minutes.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-2 text-[13px] font-semibold text-[#3A6AB6] hover:underline"
              >
                Submit another enquiry
              </button>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {/* Row 1: Company + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" required>
                  <input
                    type="text"
                    required
                    placeholder="Acme Pvt. Ltd."
                    value={form.company}
                    onChange={set('company')}
                    className={inputCls}
                  />
                </Field>
                <Field label="Your Name" required>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Joshi"
                    value={form.name}
                    onChange={set('name')}
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Row 2: Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Mobile Number" required>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputCls}
                  />
                </Field>
                <Field label="Work Email">
                  <input
                    type="email"
                    placeholder="rahul@company.com"
                    value={form.email}
                    onChange={set('email')}
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Row 3: City + Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary City" required>
                  <select
                    required
                    value={form.city}
                    onChange={set('city')}
                    className={inputCls}
                  >
                    <option value="" disabled>
                      Select city…
                    </option>
                    {CITY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Service Required" required>
                  <select
                    required
                    value={form.service}
                    onChange={set('service')}
                    className={inputCls}
                  >
                    <option value="" disabled>
                      Select service…
                    </option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Message */}
              <Field label="Additional Details">
                <textarea
                  rows={3}
                  placeholder="Number of employees, pickup schedule, fleet size requirement…"
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                className="mt-1 w-full inline-flex items-center justify-center gap-2.5 bg-[#1C1F26] hover:bg-wa-green text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-[#3A6AB6]/25 text-[14px] cursor-pointer"
              >
                <Send className="w-4 h-4" strokeWidth={2} />
                Send via WhatsApp
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                This opens WhatsApp with your details pre-filled. No account
                needed.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
