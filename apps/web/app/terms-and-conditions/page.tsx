import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
      {/* ── Page Header ── */}
      <div className="bg-[#0B1F3A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00A8E8_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-[#38BDF8] text-xs font-semibold tracking-wider uppercase mt-6 mb-4">
            Legal & Policy
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Please read these terms carefully before booking or utilizing YAANA
            Transit services.
          </p>
          <div className="mt-4 text-sm text-slate-400">
            Last updated: August 2026
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10 space-y-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              1. Service Overview
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              YAANA Transit provides premium corporate transit, chauffeur-driven
              vehicles, airport transfers, outstation travel, and corporate
              leasing solutions. All services and bookings are subject to
              vehicle availability, route feasibility, and official
              confirmation.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              2. Booking & Confirmation
            </h2>
            <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-600 space-y-2">
              <li>
                <strong className="text-slate-800">Corporate Accounts:</strong>{' '}
                Bookings initiated via the corporate portal must be authorized
                by a designated Corporate Admin or authorized user.
              </li>
              <li>
                <strong className="text-slate-800">
                  Information Accuracy:
                </strong>{' '}
                Clients are responsible for supplying accurate pickup points,
                travel dates, passenger details, and flight schedules. YAANA
                Transit is not liable for service delays stemming from
                inaccurate information.
              </li>
              <li>
                <strong className="text-slate-800">Route Alterations:</strong>{' '}
                Requests to change travel routes, departure times, or vehicle
                categories must be submitted in advance and may result in fare
                adjustments.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              3. Pricing & Billing
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              All package rates, hourly rentals, and extra kilometer charges are
              quoted in Indian Rupees (₹) and subject to applicable GST in
              accordance with Indian tax laws.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Highway tolls, state entry taxes, and parking fees will be billed
              based on actual usage unless explicitly bundled into a fixed
              corporate package. Corporate billing follows the payment cycle
              established in your master service contract.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              4. Cancellations & No-Shows
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Cancellations submitted within the permissible grace window
              defined in your contract incur no penalty. Late cancellations or
              passenger "No-Shows" (where a vehicle dispatches to the location
              but passengers do not arrive) will be charged at the standard
              minimum trip rate for that vehicle category.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              5. Passenger Guidelines & Safety
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Passengers must comply with local transportation regulations,
              including wearing seatbelts at all times. Smoking, alcohol
              consumption, or carrying hazardous substances inside YAANA Transit
              vehicles is strictly prohibited. Chauffeurs reserve the right to
              decline service to any unruly or unsafe individuals.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              6. Contact Information
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              If you have any questions regarding these terms, please contact
              our support team:
            </p>
            <div className="bg-[#F1F5F9] p-4 rounded-xl text-sm font-medium text-[#0B1F3A]">
              Email:{' '}
              <a
                href="mailto:hello@yaanatransit.com"
                className="text-[#00A8E8] hover:underline"
              >
                hello@yaanatransit.com
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
