// Path: apps/admin/src/pages/CompaniesPage.tsx
export function CompaniesPage() {
  return (
    <PageShell
      title="Companies"
      description="Manage corporate client companies."
    />
  );
}

// Path: apps/admin/src/pages/FleetPage.tsx (export from same file for now)
export function FleetPage() {
  return <PageShell title="Fleet" description="Manage your vehicle fleet." />;
}

export function BookingsPage() {
  return (
    <PageShell title="Bookings" description="View and manage all bookings." />
  );
}

export function InvoicesPage() {
  return (
    <PageShell title="Invoices" description="View and issue GST invoices." />
  );
}

export function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      description="Download GST billing reports as Excel."
    />
  );
}

export function UsersPage() {
  return (
    <PageShell
      title="Users"
      description="Manage corporate users and their company access."
    />
  );
}

// ── Shared placeholder shell ──────────────────────────────────────────
function PageShell({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-semibold text-[#1C1F26]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {title}
        </h2>
        <p className="text-[#6B7A90] text-sm mt-1">{description}</p>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F2] p-8 flex items-center justify-center min-h-[300px]">
        <p className="text-[#A0AEC0] text-sm">
          {title} module — will be built in the next step.
        </p>
      </div>
    </div>
  );
}
