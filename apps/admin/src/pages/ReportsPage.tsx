// Path: apps/admin/src/pages/ReportsPage.tsx

import { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Loader2,
  Receipt,
  CalendarCheck,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import { format, startOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

type Company = { id: string; name: string };

type ReportType = 'gst' | 'bookings' | 'revenue';

// ── Constants ─────────────────────────────────────────────────────────

const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';
const BG = '#F7F9FC';

const BOOKING_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'ENQUIRY', label: 'Enquiry' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const MONTH_OPTIONS = [
  { value: '3', label: 'Last 3 Months' },
  { value: '6', label: 'Last 6 Months' },
  { value: '12', label: 'Last 12 Months' },
  { value: '24', label: 'Last 24 Months' },
];

// ── Helpers ───────────────────────────────────────────────────────────

function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function monthStart(): string {
  return format(startOfMonth(new Date()), 'yyyy-MM-dd');
}

function apiErr(e: unknown, fallback: string): string {
  return (
    (e as { response?: { data?: { error?: { message?: string } } } })?.response
      ?.data?.error?.message ?? fallback
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
      style={{ color: NAVY }}
    >
      {children}
    </label>
  );
}

function FilterInput({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function DateInput({
  value,
  onChange,
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: string;
}) {
  return (
    <input
      type="date"
      value={value}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
      style={{ borderColor: BORDER, background: '#fff', color: NAVY }}
      onFocus={(e) => (e.target.style.borderColor = BRAND)}
      onBlur={(e) => (e.target.style.borderColor = BORDER)}
    />
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
      style={{ borderColor: BORDER, color: value ? NAVY : MUTED }}
      onFocus={(e) => (e.target.style.borderColor = BRAND)}
      onBlur={(e) => (e.target.style.borderColor = BORDER)}
    >
      {children}
    </select>
  );
}

// ── Report card ───────────────────────────────────────────────────────

type ReportCardProps = {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sheets: string[];
  active: boolean;
  onClick: () => void;
};

function ReportCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  sheets,
  active,
  onClick,
}: ReportCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-xl border transition-all duration-150 cursor-pointer"
      style={{
        borderColor: active ? BRAND : BORDER,
        background: active ? '#EBF1FB' : '#fff',
        boxShadow: active ? `0 0 0 2px ${BRAND}30` : 'none',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm mb-1"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: active ? BRAND : NAVY,
            }}
          >
            {title}
          </p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>
            {description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <FileSpreadsheet size={12} style={{ color: MUTED }} />
            {sheets.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: active ? `${BRAND}20` : '#F3F4F6',
                  color: active ? BRAND : MUTED,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 mt-1"
          style={{
            color: active ? BRAND : MUTED,
            transform: active ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          }}
        />
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export function ReportsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeReport, setActiveReport] = useState<ReportType>('gst');
  const [downloading, setDownloading] = useState(false);

  // Shared filters
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(today());
  const [companyId, setCompanyId] = useState('');

  // Booking-specific
  const [bookingStatus, setBookingStatus] = useState('');

  // Revenue-specific
  const [months, setMonths] = useState('6');

  useEffect(() => {
    api
      .get<{ data: Company[] }>('/api/admin/companies?limit=100&status=ACTIVE')
      .then((r) => setCompanies(r.data.data))
      .catch(() => {});
  }, []);

  // ── Download handler
  const downloadReport = async () => {
    setDownloading(true);
    try {
      let url = '';
      let filename = '';

      if (activeReport === 'gst') {
        const p = new URLSearchParams({
          from: dateFrom,
          to: dateTo,
          ...(companyId && { companyId }),
        });
        url = `/api/admin/reports/gst?${p}`;
        filename = `YT_GST_Report_${dateFrom}_${dateTo}.xlsx`;
      } else if (activeReport === 'bookings') {
        const p = new URLSearchParams({
          from: dateFrom,
          to: dateTo,
          ...(companyId && { companyId }),
          ...(bookingStatus && { status: bookingStatus }),
        });
        url = `/api/admin/reports/bookings?${p}`;
        filename = `YT_Booking_Summary_${dateFrom}_${dateTo}.xlsx`;
      } else {
        const p = new URLSearchParams({
          months,
          ...(companyId && { companyId }),
        });
        url = `/api/admin/reports/revenue?${p}`;
        filename = `YT_Revenue_Report_${months}months.xlsx`;
      }

      const res = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      toast.success('Report downloaded successfully.');
    } catch (e) {
      const msg = apiErr(e, 'Failed to generate report.');
      // 404 means no data in the period
      if ((e as { response?: { status?: number } })?.response?.status === 404) {
        toast.error('No data found for the selected filters.');
      } else {
        toast.error(msg);
      }
    } finally {
      setDownloading(false);
    }
  };

  const REPORTS: ReportCardProps[] = [
    {
      type: 'gst',
      title: 'GST Report',
      description:
        'Invoice-level GST breakdown with CGST, SGST and IGST columns. Required for GST filing with your CA. Includes party GSTIN and SAC code.',
      icon: Receipt,
      iconBg: '#D1FAE5',
      iconColor: '#065F46',
      sheets: ['GST Detail', 'By Company'],
      active: activeReport === 'gst',
      onClick: () => setActiveReport('gst'),
    },
    {
      type: 'bookings',
      title: 'Booking Summary',
      description:
        'All bookings in a date range with vehicle, chauffeur, amounts and status. Use to reconcile trips with corporate clients.',
      icon: CalendarCheck,
      iconBg: '#EBF1FB',
      iconColor: BRAND,
      sheets: ['All Bookings', 'By Status', 'By Service'],
      active: activeReport === 'bookings',
      onClick: () => setActiveReport('bookings'),
    },
    {
      type: 'revenue',
      title: 'Revenue Report',
      description:
        'Month-wise revenue with taxable amount, GST collected, billed vs paid breakdown and outstanding amounts per company.',
      icon: TrendingUp,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      sheets: ['Monthly Revenue', 'By Company', 'Invoice Register'],
      active: activeReport === 'revenue',
      onClick: () => setActiveReport('revenue'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
        >
          Reports
        </h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
          Download Excel reports for GST filing, client reconciliation and
          revenue tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* ── Left: Report selector ──────────────────────────────── */}
        <div className="xl:col-span-3 space-y-3">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: MUTED }}
          >
            Select Report Type
          </p>
          {REPORTS.map((r) => (
            <ReportCard key={r.type} {...r} />
          ))}
        </div>

        {/* ── Right: Filters + Download ──────────────────────────── */}
        <div className="xl:col-span-2">
          <div
            className="bg-white rounded-xl border p-5 space-y-4 sticky top-6"
            style={{ borderColor: BORDER }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: MUTED }}
            >
              Configure & Download
            </p>

            {/* Company filter — all report types */}
            <FilterInput label="Company (optional)">
              <SelectInput value={companyId} onChange={setCompanyId}>
                <option value="">All Companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectInput>
            </FilterInput>

            {/* Date range — GST + Bookings */}
            {activeReport !== 'revenue' && (
              <>
                <FilterInput label="From Date">
                  <DateInput
                    value={dateFrom}
                    onChange={setDateFrom}
                    max={dateTo}
                  />
                </FilterInput>
                <FilterInput label="To Date">
                  <DateInput
                    value={dateTo}
                    onChange={setDateTo}
                    max={today()}
                  />
                </FilterInput>
              </>
            )}

            {/* Months — Revenue only */}
            {activeReport === 'revenue' && (
              <FilterInput label="Period">
                <SelectInput value={months} onChange={setMonths}>
                  {MONTH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SelectInput>
              </FilterInput>
            )}

            {/* Booking status — Bookings only */}
            {activeReport === 'bookings' && (
              <FilterInput label="Booking Status (optional)">
                <SelectInput value={bookingStatus} onChange={setBookingStatus}>
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </SelectInput>
              </FilterInput>
            )}

            {/* What's in this report */}
            <div
              className="rounded-lg p-3 space-y-1.5"
              style={{ background: BG }}
            >
              <p className="text-xs font-semibold" style={{ color: NAVY }}>
                This report contains:
              </p>
              {REPORTS.find((r) => r.type === activeReport)?.sheets.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <FileSpreadsheet size={12} style={{ color: BRAND }} />
                  <span className="text-xs" style={{ color: MUTED }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Download button */}
            <button
              onClick={downloadReport}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: downloading ? '#6B9EE8' : BRAND,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              {downloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download size={16} /> Download Excel
                </>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: MUTED }}>
              Downloads as <strong>.xlsx</strong> — opens in Excel, Google
              Sheets or LibreOffice
            </p>
          </div>
        </div>
      </div>

      {/* ── Info cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Receipt,
            color: '#065F46',
            bg: '#D1FAE5',
            title: 'GST Filing',
            desc: 'Share the GST Report with your CA every month. It has all the columns needed for GSTR-1 and GSTR-3B filing.',
          },
          {
            icon: CalendarCheck,
            color: BRAND,
            bg: '#EBF1FB',
            title: 'Client Reconciliation',
            desc: 'Send the Booking Summary to corporate clients monthly so they can match trips against their internal records.',
          },
          {
            icon: TrendingUp,
            color: '#D97706',
            bg: '#FEF3C7',
            title: 'Revenue Tracking',
            desc: 'Use the Revenue Report for business reviews — shows billed vs collected and which clients have outstanding dues.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <card.icon size={17} style={{ color: card.color }} />
              </div>
              <p
                className="font-semibold text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
              >
                {card.title}
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
