// Path: apps/admin/src/pages/DashboardPage.tsx
export function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-semibold text-[#1C1F26]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Good morning 👋
        </h2>
        <p className="text-[#6B7A90] text-sm mt-1">
          Here's what's happening at Yana Transit today.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: '—' },
          { label: 'Active Trips', value: '—' },
          { label: 'Companies', value: '—' },
          { label: 'Revenue (MTD)', value: '—' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#E2E8F2] p-5"
          >
            <p className="text-xs font-medium text-[#6B7A90] uppercase tracking-wide mb-2">
              {s.label}
            </p>
            <p
              className="text-3xl font-bold text-[#1C1F26]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl border border-[#E2E8F2] p-6">
        <p className="text-sm text-[#6B7A90]">
          Dashboard charts and recent bookings table — coming next.
        </p>
      </div>
    </div>
  );
}
