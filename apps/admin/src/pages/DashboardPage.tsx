// Path: apps/admin/src/pages/DashboardPage.tsx

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CalendarCheck,
  Building2,
  Car,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../lib/api';
import { format } from 'date-fns';

// ── Types ─────────────────────────────────────────────────────────────

type Stats = {
  totalBookings: number;
  activeTrips: number;
  totalCompanies: number;
  revenueMtd: number;
};

type ChartPoint = { month: string; bookings: number };

type RecentBooking = {
  id: string;
  referenceNo: string;
  status: string;
  serviceType: string;
  startDate: string;
  quotedAmount: number | null;
  finalAmount: number | null;
  createdAt: string;
  company: { id: string; name: string } | null;
  pickupCity: { name: string } | null;
  vehicle: { name: string; category: string } | null;
  user: { name: string } | null;
};

type DashboardData = {
  stats: Stats;
  chartData: ChartPoint[];
  recentBookings: RecentBooking[];
};

// ── Status config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  ENQUIRY: {
    label: 'Enquiry',
    color: '#92400E',
    bg: '#FEF3C7',
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#1D4ED8',
    bg: '#DBEAFE',
    icon: CalendarCheck,
  },
  ONGOING: { label: 'Ongoing', color: '#065F46', bg: '#D1FAE5', icon: Car },
  COMPLETED: {
    label: 'Completed',
    color: '#374151',
    bg: '#F3F4F6',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#991B1B',
    bg: '#FEE2E2',
    icon: AlertCircle,
  },
};

const SERVICE_LABELS: Record<string, string> = {
  CHAUFFEUR_DRIVEN: 'Chauffeur Driven',
  AIRPORT_TRANSFER: 'Airport Transfer',
  OUTSTATION: 'Outstation',
  ETS: 'ETS',
  EVENTS: 'Events',
  CORPORATE_LEASE: 'Corporate Lease',
};

// ── Helpers ───────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Stat card ─────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
};

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-xl border p-5 flex items-start justify-between"
      style={{ borderColor: '#E2E8F2' }}
    >
      <div>
        <p className="text-xs font-semibold text-[#6B7A90] uppercase tracking-wide mb-2">
          {label}
        </p>
        <p
          className="text-3xl font-bold text-[#0B1F3A] leading-none mb-1"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-[#6B7A90] mt-1.5">{sub}</p>}
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
    </div>
  );
}

// ── Custom bar chart tooltip ──────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border rounded-lg px-3 py-2 shadow-lg text-sm"
      style={{ borderColor: '#E2E8F2' }}
    >
      <p className="font-semibold text-[#0B1F3A] mb-0.5">{label}</p>
      <p className="text-[#3A6AB6]">{payload[0].value} bookings</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ success: boolean; data: DashboardData }>('/api/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#3A6AB6]" />
          <p className="text-sm text-[#6B7A90]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
          <p className="text-sm text-[#6B7A90]">
            {error ?? 'Something went wrong.'}
          </p>
        </div>
      </div>
    );
  }

  const { stats, chartData, recentBookings } = data;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div>
        <h2
          className="text-xl font-semibold text-[#0B1F3A]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Good {getGreeting()} 👋
        </h2>
        <p className="text-sm text-[#6B7A90] mt-0.5">
          Here's what's happening at Yana Transit today.
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings.toString()}
          icon={CalendarCheck}
          iconBg="#EBF1FB"
          iconColor="#3A6AB6"
          sub="All time"
        />
        <StatCard
          label="Active Trips"
          value={stats.activeTrips.toString()}
          icon={Car}
          iconBg="#D1FAE5"
          iconColor="#059669"
          sub="Ongoing + Confirmed"
        />
        <StatCard
          label="Companies"
          value={stats.totalCompanies.toString()}
          icon={Building2}
          iconBg="#F3F4F6"
          iconColor="#374151"
          sub="Active clients"
        />
        <StatCard
          label="Revenue MTD"
          value={formatINR(stats.revenueMtd)}
          icon={TrendingUp}
          iconBg="#FEF3C7"
          iconColor="#D97706"
          sub="This month (incl. GST)"
        />
      </div>

      {/* ── Chart + Recent bookings ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Bar chart — 3/5 width on xl */}
        <div
          className="xl:col-span-3 bg-white rounded-xl border p-5"
          style={{ borderColor: '#E2E8F2' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p
                className="text-sm font-semibold text-[#0B1F3A]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Bookings Overview
              </p>
              <p className="text-xs text-[#6B7A90] mt-0.5">Last 6 months</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-[#059669] bg-[#D1FAE5] px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              Active
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0F2F5"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11,
                  fill: '#9CA3AF',
                  fontFamily: 'Outfit, sans-serif',
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: '#9CA3AF',
                  fontFamily: 'Outfit, sans-serif',
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: '#F0F5FF' }}
              />
              <Bar dataKey="bookings" fill="#3A6AB6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats sidebar — 2/5 width on xl */}
        <div
          className="xl:col-span-2 bg-white rounded-xl border p-5 space-y-4"
          style={{ borderColor: '#E2E8F2' }}
        >
          <p
            className="text-sm font-semibold text-[#0B1F3A]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Booking Breakdown
          </p>

          {/* Status counts from recent bookings */}
          {(['ENQUIRY', 'CONFIRMED', 'ONGOING', 'COMPLETED'] as const).map(
            (status) => {
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.icon;
              const count = recentBookings.filter(
                (b) => b.status === status
              ).length;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <Icon size={15} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium text-[#374151]">
                        {cfg.label}
                      </p>
                      <p className="text-xs font-bold text-[#0B1F3A]">
                        {count}
                      </p>
                    </div>
                    <div className="h-1 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            recentBookings.length
                              ? (count / recentBookings.length) * 100
                              : 0
                          }%`,
                          background: cfg.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}

          <div className="pt-2 border-t" style={{ borderColor: '#E2E8F2' }}>
            <p className="text-xs text-[#6B7A90]">
              Based on last 10 bookings shown below
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent bookings table ────────────────────────────────────── */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: '#E2E8F2' }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#E2E8F2' }}
        >
          <p
            className="text-sm font-semibold text-[#0B1F3A]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Recent Bookings
          </p>
          <a
            href="/bookings"
            className="text-xs font-medium text-[#3A6AB6] hover:underline flex items-center gap-1"
          >
            View all <ArrowUpRight size={12} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F9FC' }}>
                {[
                  'Ref No.',
                  'Company',
                  'Service',
                  'City',
                  'Date',
                  'Amount',
                  'Status',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A90] uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => {
                const cfg =
                  STATUS_CONFIG[booking.status] ?? STATUS_CONFIG['ENQUIRY'];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={booking.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    style={{ borderColor: '#F0F2F5' }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-[#3A6AB6]">
                        {booking.referenceNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0B1F3A] text-xs leading-tight">
                        {booking.company?.name ?? '—'}
                      </p>
                      <p className="text-[#9CA3AF] text-xs mt-0.5">
                        {booking.user?.name ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#374151] whitespace-nowrap">
                      {SERVICE_LABELS[booking.serviceType] ??
                        booking.serviceType}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#374151]">
                      {booking.pickupCity?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#374151] whitespace-nowrap">
                      {format(new Date(booking.startDate), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-[#0B1F3A] whitespace-nowrap">
                      {booking.finalAmount
                        ? formatINR(Number(booking.finalAmount))
                        : booking.quotedAmount
                        ? `~${formatINR(Number(booking.quotedAmount))}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <Icon size={11} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#9CA3AF]"
                  >
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Greeting helper ───────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
