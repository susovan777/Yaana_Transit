// Path: components\home\InquirySection.tsx

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, Clock } from 'lucide-react';

import { SERVICES } from '@/lib/data/services';
import { buildWhatsAppUrl, SITE } from '@/lib/constants';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type FormState = {
  name: string;
  mobile: string;
  city: string;
  date: string;
  service: string;
};

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerLeft = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─────────────────────────────────────────
// CONTACT ITEM — left column rows
// ─────────────────────────────────────────
function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-btn bg-sky-brand/25 text-[#7EB3FF] shrink-0">
        {icon}
      </div>
      <div className="text-[14px] text-white/80">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────
// FORM INPUT
// ─────────────────────────────────────────
function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-navy tracking-[0.3px]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-3.5 py-[11px] rounded-btn border-[1.5px] border-line text-[14px] text-navy placeholder:text-[#A0AEC0] outline-none transition-all duration-200 focus:border-sky-brand focus:shadow-[0_0_0_3px_rgba(46,111,216,0.1)]"
      />
    </div>
  );
}

// ─────────────────────────────────────────
// FORM SELECT
// ─────────────────────────────────────────
function FormSelect({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-navy tracking-[0.3px]">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="px-3.5 py-[11px] rounded-btn border-[1.5px] border-line text-[14px] text-navy outline-none transition-all duration-200 focus:border-sky-brand focus:shadow-[0_0_0_3px_rgba(46,111,216,0.1)] bg-white appearance-none cursor-pointer"
      >
        <option value="">Select a service…</option>
        {SERVICES.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────
// INQUIRY SECTION
// ─────────────────────────────────────────
export default function InquirySection() {
  const [form, setForm] = useState<FormState>({
    name: '',
    mobile: '',
    city: '',
    date: '',
    service: '',
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    const msg = [
      "Hi Yana Transite! I'd like to make an enquiry.",
      '',
      `Name: ${form.name || '—'}`,
      `Mobile: ${form.mobile || '—'}`,
      `Pickup City: ${form.city || '—'}`,
      `Travel Date: ${form.date || '—'}`,
      `Service: ${form.service || 'Not specified'}`,
    ].join('\n');

    window.open(buildWhatsAppUrl(msg), '_blank');
  }

  return (
    <section id="inquiry" className="bg-white py-16 px-6 md:px-10 xl:px-14">
      <div className="max-w-[1280px] mx-auto">
        {/* ── Outer card (navy) ── */}
        <div className="relative bg-navy rounded-[24px] overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(46,111,216,0.3) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* ── LEFT: Contact info ── */}
            <motion.div
              className="flex flex-col gap-8 p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-white/10"
              variants={staggerLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {/* Pill + heading */}
              <div>
                <motion.div
                  variants={fadeLeft}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-brand/20 border border-sky-brand/35 text-[12px] font-semibold text-[#7EB3FF] tracking-[0.5px] mb-4"
                >
                  📞 Get in Touch
                </motion.div>

                <motion.h2
                  variants={fadeLeft}
                  className="text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.12] text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Book by <em className="not-italic text-[#7EB3FF]">Call</em>
                  <br />
                  or WhatsApp
                </motion.h2>

                <motion.p
                  variants={fadeLeft}
                  className="mt-3 text-[15px] leading-[1.75] text-white/55 max-w-[380px]"
                >
                  No complicated forms. Tell us your travel dates, city and
                  preferred car — we confirm in minutes.
                </motion.p>
              </div>

              {/* Contact items */}
              <motion.div variants={fadeLeft} className="flex flex-col gap-4">
                <ContactItem
                  icon={<Phone className="w-4 h-4" strokeWidth={2} />}
                >
                  <a
                    href={`tel:${SITE.phoneRaw}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.phone}
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<MessageCircle className="w-4 h-4" strokeWidth={2} />}
                >
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Chat on WhatsApp
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                >
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {SITE.email}
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                >
                  <span className="text-white/60">
                    Available 6 AM – 11 PM, 7 days a week
                  </span>
                </ContactItem>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Form card ── */}
            <motion.div
              className="p-10 md:p-14 flex items-center"
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="w-full bg-white rounded-card p-8 flex flex-col gap-5">
                {/* Card title */}
                <div>
                  <h3
                    className="text-[20px] font-bold text-navy"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Quick Inquiry
                  </h3>
                  <p className="text-[13px] text-muted mt-1">
                    We&apos;ll call or WhatsApp you back within 15 minutes.
                  </p>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Your Name"
                    name="name"
                    placeholder="Rahul Joshi"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={form.mobile}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Pickup City"
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="Travel Date"
                    name="date"
                    type="date"
                    placeholder=""
                    value={form.date}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Service select */}
                <FormSelect
                  label="Car / Service Type"
                  name="service"
                  value={form.service}
                  onChange={handleSelectChange}
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-btn bg-navy text-white text-[14px] font-semibold transition-all duration-200 hover:bg-sky-brand hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(46,111,216,0.35)]"
                >
                  {/* WhatsApp icon inline */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </button>

                <p className="text-[12px] text-muted text-center">
                  Or call us directly at{' '}
                  <a
                    href={`tel:${SITE.phoneRaw}`}
                    className="font-semibold text-navy hover:text-sky-brand transition-colors"
                  >
                    {SITE.phone}
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
