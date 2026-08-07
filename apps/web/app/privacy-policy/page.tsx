import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
      {/* ── Page Header ── */}
      <div className="bg-[#0B1F3A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00A8E8_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-[#38BDF8] text-xs font-semibold tracking-wider uppercase mt-6 mb-4">
            Data Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            How YAANA Transit collects, protects, and manages your business and
            personal data.
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
              1. Information We Collect
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              To deliver seamless corporate mobility, we gather necessary
              operational details including:
            </p>
            <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-600 space-y-1.5">
              <li>
                <strong className="text-slate-800">Account Details:</strong>{' '}
                Full name, corporate email address, contact number, role, and
                company affiliation.
              </li>
              <li>
                <strong className="text-slate-800">
                  Booking & Route Data:
                </strong>{' '}
                Pickup/drop locations, travel dates, flight numbers, and
                passenger counts.
              </li>
              <li>
                <strong className="text-slate-800">Financial Records:</strong>{' '}
                Company GSTIN, billing addresses, and payment transaction logs.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              2. How We Use Your Data
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              We process your information strictly for legitimate operational
              purposes:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-[#0B1F3A] text-sm mb-1">
                  Trip Execution
                </h4>
                <p className="text-xs text-slate-500">
                  Dispatching chauffeurs, routing vehicles, and sending
                  real-time trip status updates.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-[#0B1F3A] text-sm mb-1">
                  Billing & Compliance
                </h4>
                <p className="text-xs text-slate-500">
                  Generating automated GST tax invoices and accounting
                  reconciliation reports.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 Highlight Box */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              3. Strict Company Data Isolation
            </h2>
            <div className="p-5 rounded-xl bg-sky-50/50 border border-sky-100 text-sm text-slate-700 space-y-2">
              <p className="font-medium text-[#0B1F3A]">
                🔒 Enterprise-Grade Data Partitioning
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                YAANA Transit operates on a multi-tenant isolated database
                structure. Your corporate bookings, employee details, and
                financial reports are completely partitioned and strictly
                inaccessible to users from any other company on the platform.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              4. Data Sharing & Third Parties
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              We <strong className="text-slate-800">never sell or rent</strong>{' '}
              your personal or corporate data to third-party advertisers. Data
              is shared exclusively with assignees necessary for service
              fulfillment (such as designated chauffeurs receiving passenger
              names and pickup contacts) or when required by law or tax
              regulations.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B1F3A] flex items-center gap-2">
              5. Contact Us
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              For any questions regarding your data privacy rights, email us at:
            </p>
            <div className="bg-[#F1F5F9] p-4 rounded-xl text-sm font-medium text-[#0B1F3A]">
              Email:{' '}
              <a
                href="mailto:privacy@yaanatransit.com"
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
