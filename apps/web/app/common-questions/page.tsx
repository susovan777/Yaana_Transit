// Path: apps\web\app\common-questions\page.tsx

'use client';

import { useState } from 'react';

const FAQ_DATA = [
  {
    category: 'Booking & Services',
    questions: [
      {
        q: 'How far in advance should I book a vehicle with YAANA Transit?',
        a: 'We recommend booking at least 12 to 24 hours in advance to guarantee vehicle availability. However, for urgent corporate transit or airport transfers, our team can often dispatch a vehicle within 2 to 4 hours depending on the city.',
      },
      {
        q: 'What types of transit services do you offer for corporate clients?',
        a: 'YAANA Transit provides a wide range of corporate mobility solutions, including airport transfers, daily chauffeur-driven rentals, outstation trips, event transport management, and long-term executive vehicle leases.',
      },
      {
        q: 'Can I modify my pickup time or route after booking?',
        a: 'Yes. You can request changes to your schedule or route directly through your corporate dashboard or by contacting your assigned account manager. Please note that route alterations may be subject to fare adjustments based on distance and time.',
      },
      {
        q: 'What happens if my flight is delayed for an airport pickup?',
        a: 'We actively track incoming flight schedules using your flight number. Your chauffeur will automatically adjust their arrival time to match your actual landing time, ensuring you are met seamlessly without unnecessary waiting charges.',
      },
    ],
  },
  {
    category: 'Corporate Accounts & Portal',
    questions: [
      {
        q: 'How does corporate user access and permission work?',
        a: 'YAANA Transit utilizes a secure multi-tenant system. Company account creation is invite-only. Corporate Admins can manage users, view all bookings, and download invoices, while regular Corporate Users can make booking requests for assigned trips.',
      },
      {
        q: 'Is our company’s travel and billing data visible to other clients?',
        a: 'No. Our platform enforces strict database isolation. Your company’s bookings, passenger names, and billing histories are fully partitioned and completely inaccessible to any other client organization.',
      },
      {
        q: 'How do new employees activate their company travel profiles?',
        a: 'Once a YAANA Admin or your Corporate Admin adds an employee’s work email to the system, an automated activation email is sent. The employee simply clicks the link, sets a private password, and can immediately begin booking.',
      },
    ],
  },
  {
    category: 'Fleet & Chauffeurs',
    questions: [
      {
        q: 'Are YAANA Transit chauffeurs background-checked and verified?',
        a: 'Absolutely. Every chauffeur undergoes thorough background checks, identity verification, defensive driving evaluations, and professional etiquette training before operating any YAANA Transit vehicle.',
      },
      {
        q: 'What categories of vehicles are available in your fleet?',
        a: 'Our fleet ranges from premium sedans (Dzire, Etios) and executive sedans (Camry, C-Class) to spacious MPVs/SUVs (Innova Crysta, Hycross) and luxury coaches for team outings.',
      },
      {
        q: 'Are fuel, tolls, and driver allowances included in the fare?',
        a: 'Base fares cover vehicle rental and driver services. Tolls, state entry taxes, and parking fees are charged transparently based on actual usage during the trip, or billed according to your custom corporate contract terms.',
      },
    ],
  },
  {
    category: 'Billing & Payments',
    questions: [
      {
        q: 'How and when will our company be invoiced?',
        a: 'Invoices are generated automatically post-trip or compiled as a consolidated monthly statement based on your corporate billing agreement. Invoices are accessible via the portal with full GST breakdowns.',
      },
      {
        q: 'What payment methods do you support for settled invoices?',
        a: 'We accept NEFT/RTGS bank transfers, corporate cards, UPI, and authorized digital wallet payments. Payment links can also be generated directly from your invoice portal.',
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] =
    useState<string>('Booking & Services');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentCategoryData = FAQ_DATA.find(
    (item) => item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
      {/* ── Page Header ── */}
      <div className="bg-[#0B1F3A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00A8E8_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-[#38BDF8] text-xs font-semibold tracking-wider uppercase mt-6 mb-4">
            Help & Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Find quick answers to common questions about YAANA Transit bookings,
            chauffeur standards, corporate accounts, and billing.
          </p>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FAQ_DATA.map((cat) => {
            const isActive = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => {
                  setActiveCategory(cat.category);
                  setOpenIndex(null); // Reset open question on tab switch
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {currentCategoryData?.questions.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-[#0B1F3A] text-sm sm:text-base pr-4">
                    {item.q}
                  </span>
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-[#00A8E8] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-sky-50' : ''
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-14 bg-linear-to-br from-[#0B1F3A] to-[#162D50] rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-lg mx-auto space-y-3">
            <h2 className="text-2xl font-bold">
              Have a specific question not answered here?
            </h2>
            <p className="text-base text-slate-300">
              Our corporate support team is available 24/7 to assist with
              specialized bookings, fleet inquiries, and platform onboarding.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:hello@yaanatransit.com"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-sky-brand hover:bg-[#2560C0] text-white text-[15px] font-semibold transition-all shadow-sm"
              >
                Contact Support Team
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
