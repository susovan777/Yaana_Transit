// Path: apps/admin/src/pages/InvoicesPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  Send,
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Ban,
  IndianRupee,
  Building2,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  sacCode: string;
  gstType: string | null;
  issueDate: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    gstNumber: string | null;
    email: string | null;
  };
  booking: {
    id: string;
    referenceNo: string;
    serviceType: string;
    startDate: string;
    vehicle: { name: string } | null;
    chauffeurName: string | null;
  };
  payments: {
    id: string;
    amount: number;
    status: string;
    method: string | null;
    referenceNo: string | null;
    paidAt: string | null;
    createdAt: string;
  }[];
};

type Company = { id: string; name: string };
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ── Constants ─────────────────────────────────────────────────────────

const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';
const BG = '#F7F9FC';

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  DRAFT: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6', icon: FileText },
  SENT: { label: 'Sent', color: '#1D4ED8', bg: '#DBEAFE', icon: Send },
  PAID: { label: 'Paid', color: '#065F46', bg: '#D1FAE5', icon: CheckCircle2 },
  OVERDUE: {
    label: 'Overdue',
    color: '#991B1B',
    bg: '#FEE2E2',
    icon: AlertCircle,
  },
  CANCELLED: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: Ban },
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

function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}
function apiErr(e: unknown, fallback: string) {
  return (
    (e as { response?: { data?: { error?: { message?: string } } } })?.response
      ?.data?.error?.message ?? fallback
  );
}

// ── UI atoms ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
        style={{ color: NAVY }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
      style={{ borderColor: BORDER, background: '#fff', color: NAVY }}
      onFocus={(e) => (e.target.style.borderColor = BRAND)}
      onBlur={(e) => (e.target.style.borderColor = BORDER)}
    />
  );
}

// ── Drawer ────────────────────────────────────────────────────────────

function Drawer({
  open,
  onClose,
  title,
  width = 560,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(11,31,58,0.4)' }}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: Math.min(width, window.innerWidth) }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: BORDER }}
        >
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
}

// ── Payment form schema ───────────────────────────────────────────────

const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  method: z
    .enum(['bank_transfer', 'upi', 'cheque', 'online', 'cash'])
    .optional(),
  referenceNo: z.string().optional(),
  notes: z.string().optional(),
});
type PaymentForm = z.infer<typeof paymentSchema>;

// ── Main page ─────────────────────────────────────────────────────────

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [summary, setSummary] = useState({ totalAmount: 0 });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>(
    'ALL'
  );
  const [companyFilter, setCompanyFilter] = useState('');

  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema as any),
  });

  useEffect(() => {
    api
      .get<{ data: Company[] }>('/api/admin/companies?limit=100')
      .then((r) => setCompanies(r.data.data))
      .catch(() => {});
  }, []);

  const fetchInvoices = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const p = new URLSearchParams({
          page: String(page),
          limit: '15',
          ...(search && { search }),
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
          ...(companyFilter && { companyId: companyFilter }),
        });
        const res = await api.get<{
          data: Invoice[];
          pagination: Pagination;
          summary: { totalAmount: number };
        }>(`/api/admin/invoices?${p}`);
        setInvoices(res.data.data);
        setPagination(res.data.pagination);
        setSummary(res.data.summary);
      } catch {
        toast.error('Failed to load invoices.');
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, companyFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchInvoices(1), 350);
    return () => clearTimeout(t);
  }, [fetchInvoices]);

  // ── Download PDF ─────────────────────────────────────────────────
  const downloadPdf = async (invoice: Invoice) => {
    setMenuOpen(null);
    setDownloadingId(invoice.id);
    try {
      const res = await api.get(`/api/admin/invoices/${invoice.id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded.');
    } catch {
      toast.error('Failed to download PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Send to customer ────────────────────────────────────────────
  const sendToCustomer = async (invoice: Invoice) => {
    setMenuOpen(null);
    if (!invoice.company.email) {
      toast.error('This company has no billing email on file.');
      return;
    }
    setSendingId(invoice.id);
    try {
      await api.post(`/api/admin/invoices/${invoice.id}/send`);
      toast.success(`Invoice emailed to ${invoice.company.email}.`);
      fetchInvoices(pagination.page);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to send invoice.'));
    } finally {
      setSendingId(null);
    }
  };

  // ── Record payment ──────────────────────────────────────────────
  const openPayment = (invoice: Invoice) => {
    setMenuOpen(null);
    setDetailInvoice(null);
    setPaymentInvoice(invoice);
    const paid = invoice.payments
      .filter((p) => p.status === 'PAID')
      .reduce((s, p) => s + Number(p.amount), 0);
    const remaining = Number(invoice.total) - paid;
    paymentForm.reset({
      amount: remaining > 0 ? remaining : Number(invoice.total),
    });
  };

  const onPaymentSubmit = async (data: PaymentForm) => {
    if (!paymentInvoice) return;
    setSubmitting(true);
    try {
      await api.post(`/api/admin/invoices/${paymentInvoice.id}/payments`, data);
      toast.success('Payment recorded.');
      setPaymentInvoice(null);
      fetchInvoices(pagination.page);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to record payment.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Mark status ──────────────────────────────────────────────────
  //   const markStatus = async (invoice: Invoice, status: InvoiceStatus) => {
  //     setMenuOpen(null);
  //     try {
  //       await api.patch(`/api/admin/invoices/${invoice.id}/status`, { status });
  //       toast.success(`Marked as ${status}.`);
  //       fetchInvoices(pagination.page);
  //     } catch (e) {
  //       toast.error(apiErr(e, 'Failed to update status.'));
  //     }
  //   };

  return (
    <div className="space-y-4" onClick={() => menuOpen && setMenuOpen(null)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            Invoices
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {pagination.total} invoice{pagination.total !== 1 ? 's' : ''} ·{' '}
            {inr(summary.totalAmount)} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-3 flex items-center gap-3 flex-wrap"
        style={{ borderColor: BORDER }}
      >
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <input
            type="text"
            placeholder="Search invoice no. or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: BORDER, color: NAVY, background: BG }}
            onFocus={(e) => (e.target.style.borderColor = BRAND)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          />
        </div>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            borderColor: BORDER,
            color: companyFilter ? NAVY : MUTED,
            background: BG,
          }}
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div
          className="flex items-center gap-1 p-1 rounded-lg overflow-x-auto"
          style={{ background: BG }}
        >
          {(
            ['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] as const
          ).map((s) => {
            const isAll = s === 'ALL';
            const cfg = isAll ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap"
                style={{
                  background:
                    statusFilter === s
                      ? isAll
                        ? '#fff'
                        : cfg!.bg
                      : 'transparent',
                  color:
                    statusFilter === s ? (isAll ? NAVY : cfg!.color) : MUTED,
                  boxShadow:
                    statusFilter === s ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {isAll ? 'All' : cfg!.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: BORDER }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: BG }}>
                {[
                  'Invoice No.',
                  'Company',
                  'Booking Ref.',
                  'Issue Date',
                  'Due Date',
                  'Amount',
                  'Status',
                  '',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: MUTED }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto"
                      style={{ color: BRAND }}
                    />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <FileText
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm" style={{ color: MUTED }}>
                      No invoices yet. Invoices are auto-created when bookings
                      complete.
                    </p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    style={{ borderColor: '#F0F2F5' }}
                    onClick={() => setDetailInvoice(inv)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: BRAND }}
                      >
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-xs font-semibold truncate max-w-[150px]"
                        style={{ color: NAVY }}
                      >
                        {inv.company.name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: MUTED }}
                      >
                        {inv.booking.referenceNo}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {format(new Date(inv.issueDate), 'dd MMM yyyy')}
                    </td>
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {inv.dueDate
                        ? format(new Date(inv.dueDate), 'dd MMM yyyy')
                        : '—'}
                    </td>
                    <td
                      className="px-4 py-3 text-xs font-semibold whitespace-nowrap"
                      style={{ color: NAVY }}
                    >
                      {inr(Number(inv.total))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === inv.id ? null : inv.id)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpen === inv.id && (
                        <div
                          className="absolute right-0 top-10 z-30 bg-white rounded-xl border shadow-lg py-1 min-w-[190px]"
                          style={{
                            borderColor: BORDER,
                            boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
                          }}
                        >
                          <button
                            onClick={() => downloadPdf(inv)}
                            disabled={downloadingId === inv.id}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                            style={{ color: NAVY }}
                          >
                            {downloadingId === inv.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Download size={14} style={{ color: MUTED }} />
                            )}
                            Download PDF
                          </button>
                          <button
                            onClick={() => sendToCustomer(inv)}
                            disabled={sendingId === inv.id}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                            style={{ color: NAVY }}
                          >
                            {sendingId === inv.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} style={{ color: MUTED }} />
                            )}
                            Email to Customer
                          </button>
                          {inv.status !== 'PAID' &&
                            inv.status !== 'CANCELLED' && (
                              <button
                                onClick={() => openPayment(inv)}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                                style={{ color: '#059669' }}
                              >
                                <IndianRupee size={14} /> Record Payment
                              </button>
                            )}
                          <div
                            className="my-1 border-t"
                            style={{ borderColor: BORDER }}
                          />
                          <button
                            onClick={() => setDetailInvoice(inv)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                            style={{ color: NAVY }}
                          >
                            <FileText size={14} style={{ color: MUTED }} /> View
                            Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: BORDER }}
          >
            <p className="text-xs" style={{ color: MUTED }}>
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchInvoices(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                style={{ color: MUTED }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - pagination.page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchInvoices(p)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold"
                    style={{
                      background: p === pagination.page ? BRAND : 'transparent',
                      color: p === pagination.page ? '#fff' : MUTED,
                    }}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => fetchInvoices(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                style={{ color: MUTED }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Drawer */}
      <Drawer
        open={!!detailInvoice}
        onClose={() => setDetailInvoice(null)}
        title="Invoice Details"
      >
        {detailInvoice && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="font-mono text-lg font-bold"
                  style={{ color: BRAND }}
                >
                  {detailInvoice.invoiceNumber}
                </p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                  Issued{' '}
                  {format(new Date(detailInvoice.issueDate), 'dd MMM yyyy')}
                </p>
              </div>
              <StatusBadge status={detailInvoice.status} />
            </div>

            <div
              className="p-4 rounded-xl border space-y-2"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-center gap-2">
                <Building2 size={14} style={{ color: MUTED }} />
                <span className="text-sm font-semibold" style={{ color: NAVY }}>
                  {detailInvoice.company.name}
                </span>
              </div>
              {detailInvoice.company.gstNumber && (
                <p className="text-xs font-mono ml-6" style={{ color: MUTED }}>
                  GST: {detailInvoice.company.gstNumber}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Calendar size={14} style={{ color: MUTED }} />
                <span className="text-xs" style={{ color: NAVY }}>
                  {SERVICE_LABELS[detailInvoice.booking.serviceType]} —{' '}
                  {format(
                    new Date(detailInvoice.booking.startDate),
                    'dd MMM yyyy'
                  )}
                </span>
              </div>
              <p className="text-xs font-mono ml-6" style={{ color: MUTED }}>
                Booking: {detailInvoice.booking.referenceNo}
              </p>
            </div>

            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: BORDER }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: BORDER, background: BG }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: MUTED }}
                >
                  GST Breakdown
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: MUTED }}>Subtotal</span>
                  <span style={{ color: NAVY }}>
                    {inr(Number(detailInvoice.subtotal))}
                  </span>
                </div>
                {detailInvoice.gstType === 'IGST' ? (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: MUTED }}>IGST (18%)</span>
                    <span style={{ color: NAVY }}>
                      {inr(Number(detailInvoice.igst))}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: MUTED }}>CGST (9%)</span>
                      <span style={{ color: NAVY }}>
                        {inr(Number(detailInvoice.cgst))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: MUTED }}>SGST (9%)</span>
                      <span style={{ color: NAVY }}>
                        {inr(Number(detailInvoice.sgst))}
                      </span>
                    </div>
                  </>
                )}
                <div
                  className="flex justify-between text-sm font-bold pt-2 border-t"
                  style={{ borderColor: BORDER }}
                >
                  <span style={{ color: NAVY }}>Total</span>
                  <span style={{ color: BRAND }}>
                    {inr(Number(detailInvoice.total))}
                  </span>
                </div>
              </div>
            </div>

            {detailInvoice.payments.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                  Payment History
                </p>
                <div className="space-y-2">
                  {detailInvoice.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F2]"
                    >
                      <div>
                        <p
                          className="text-sm text-[#0B1F3A] font-semibold"
                        >
                          {inr(Number(p.amount))}
                        </p>
                        <p className="text-xs text-[#6B7A90]">
                          {p.method ?? '—'}{' '}
                          {p.referenceNo && `· ${p.referenceNo}`}
                        </p>
                      </div>
                      <p className="text-xs text-[#6B7A90]" style={{ color: MUTED }}>
                        {p.paidAt
                          ? format(new Date(p.paidAt), 'dd MMM yyyy')
                          : '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => downloadPdf(detailInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm text-[#0B1F3A] font-semibold border-[#E2E8F2] hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={() => sendToCustomer(detailInvoice)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#3A6AB6] hover:bg-sky-900 text-white transition-colors cursor-pointer"
              >
                <Send size={14} /> Email
              </button>
            </div>
            {detailInvoice.status !== 'PAID' &&
              detailInvoice.status !== 'CANCELLED' && (
                <button
                  onClick={() => openPayment(detailInvoice)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#059669] text-white"
                >
                  <IndianRupee size={14} /> Record Payment
                </button>
              )}
          </div>
        )}
      </Drawer>

      {/* ── Payment Drawer */}
      <Drawer
        open={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        title="Record Payment"
        width={420}
      >
        {paymentInvoice && (
          <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ background: BG }}>
                <p className="text-xs" style={{ color: MUTED }}>
                  Invoice Total
                </p>
                <p className="text-lg font-bold" style={{ color: NAVY }}>
                  {inr(Number(paymentInvoice.total))}
                </p>
              </div>
              <Field label="Amount (₹)" required>
                <Input
                  type="number"
                  step="0.01"
                  {...paymentForm.register('amount')}
                />
              </Field>
              <Field label="Payment Method">
                <select
                  {...paymentForm.register('method')}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                  style={{ borderColor: BORDER, color: NAVY }}
                >
                  <option value="">Select method…</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </select>
              </Field>
              <Field label="Reference No. (UTR / Cheque No.)">
                <Input
                  placeholder="UTR1234567890"
                  {...paymentForm.register('referenceNo')}
                />
              </Field>
              <Field label="Notes">
                <Input
                  placeholder="Optional notes"
                  {...paymentForm.register('notes')}
                />
              </Field>
            </div>
            <div
              className="flex gap-3 mt-6 pt-4 border-t sticky bottom-0 bg-white pb-2"
              style={{ borderColor: BORDER }}
            >
              <button
                type="button"
                onClick={() => setPaymentInvoice(null)}
                className="flex-1 py-2.5 rounded-lg border text-sm font-semibold"
                style={{ borderColor: BORDER, color: NAVY }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: '#059669' }}
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? 'Recording…' : 'Record Payment'}
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
}
