// Path: apps/admin/src/pages/CompaniesPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Building2,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Users,
  CalendarCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types
type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  gstNumber: string | null;
  contractStart: string | null;
  contractEnd: string | null;
  createdAt: string;
  _count: { users: number; bookings: number };
};
type CompanyDetail = Company & {
  pan: string | null;
  address: string | null;
  pincode: string | null;
  creditLimit: number | null;
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLoginAt: string | null;
  }[];
};
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ── Schema
const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST format'
    )
    .or(z.literal(''))
    .optional(),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .or(z.literal(''))
    .optional(),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().min(10, 'Enter valid phone').or(z.literal('')).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, 'Invalid pincode')
    .or(z.literal(''))
    .optional(),

  // ── UPDATE THIS FIELD ──────────────────────────────────────────────
  creditLimit: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive().optional()
  ),
  // ───────────────────────────────────────────────────────────────────

  contractStart: z.string().optional(),
  contractEnd: z.string().optional(),
});
type CompanyForm = z.infer<typeof companySchema>;
type CompanyFormInput = z.input<typeof companySchema>;

// ── Constants
const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';
const BG = '#F7F9FC';
const ROLE_LABELS: Record<string, string> = {
  CORPORATE_ADMIN: 'Admin',
  CORPORATE_USER: 'User',
};

// ── Helpers
function apiErrMsg(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { error?: { message?: string } } } })
      ?.response?.data?.error?.message ?? fallback
  );
}

// ── Field wrapper
function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Input
function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all"
      style={{
        borderColor: error ? '#EF4444' : BORDER,
        background: '#fff',
        color: NAVY,
      }}
      onFocus={(e) => {
        (e.target as HTMLInputElement).style.borderColor = BRAND;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        (e.target as HTMLInputElement).style.borderColor = error
          ? '#EF4444'
          : BORDER;
        props.onBlur?.(e);
      }}
    />
  );
}

// ── Status badge
function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: status === 'ACTIVE' ? '#D1FAE5' : '#F3F4F6',
        color: status === 'ACTIVE' ? '#065F46' : '#6B7280',
      }}
    >
      {status === 'ACTIVE' ? (
        <CheckCircle2 size={11} />
      ) : (
        <AlertCircle size={11} />
      )}
      {status === 'ACTIVE' ? 'Active' : 'Inactive'}
    </span>
  );
}

// ── Drawer
function Drawer({
  open,
  onClose,
  title,
  children,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
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
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
}

// ── Submit button
function SubmitBtn({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
      style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
}

// ── Form fields (shared between add + edit)
function CompanyFormFields({
  form,
}: {
  form: UseFormReturn<CompanyFormInput, any, CompanyForm>;
}) {
  const {
    register,
    formState: { errors },
  } = form;
  const section = (label: string) => (
    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
      {label}
    </p>
  );
  return (
    <div className="space-y-5">
      <div>
        {section('Basic Info')}
        <div className="space-y-3">
          <Field label="Company Name" error={errors.name?.message} required>
            <Input
              {...register('name')}
              placeholder="Acme Technologies Pvt. Ltd."
              error={errors.name?.message}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GST Number" error={errors.gstNumber?.message}>
              <Input
                {...register('gstNumber')}
                placeholder="27AAPFU0939F1ZV"
                error={errors.gstNumber?.message}
              />
            </Field>
            <Field label="PAN" error={errors.pan?.message}>
              <Input
                {...register('pan')}
                placeholder="AAPFU0939F"
                error={errors.pan?.message}
              />
            </Field>
          </div>
        </div>
      </div>
      <div>
        {section('Contact')}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" error={errors.email?.message}>
            <Input
              {...register('email')}
              type="email"
              placeholder="travel@company.in"
              error={errors.email?.message}
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input
              {...register('phone')}
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
            />
          </Field>
        </div>
      </div>
      <div>
        {section('Address')}
        <div className="space-y-3">
          <Field label="Street Address" error={errors.address?.message}>
            <Input
              {...register('address')}
              placeholder="123 Business Park"
              error={errors.address?.message}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="City" error={errors.city?.message}>
              {' '}
              <Input
                {...register('city')}
                placeholder="Mumbai"
                error={errors.city?.message}
              />
            </Field>
            <Field label="State" error={errors.state?.message}>
              {' '}
              <Input
                {...register('state')}
                placeholder="Maharashtra"
                error={errors.state?.message}
              />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              {' '}
              <Input
                {...register('pincode')}
                placeholder="400093"
                error={errors.pincode?.message}
              />
            </Field>
          </div>
        </div>
      </div>
      <div>
        {section('Contract')}
        <div className="space-y-3">
          <Field label="Credit Limit (₹)" error={errors.creditLimit?.message}>
            <Input
              {...register('creditLimit')}
              type="number"
              placeholder="100000"
              error={errors.creditLimit?.message}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contract Start" error={errors.contractStart?.message}>
              <Input
                {...register('contractStart')}
                type="date"
                error={errors.contractStart?.message}
              />
            </Field>
            <Field label="Contract End" error={errors.contractEnd?.message}>
              <Input
                {...register('contractEnd')}
                type="date"
                error={errors.contractEnd?.message}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DrawerFooter
function DrawerFooter({
  onCancel,
  submitting,
  label,
  loadingLabel,
}: {
  onCancel: () => void;
  submitting: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <div
      className="flex gap-3 mt-6 pt-4 border-t sticky bottom-0 bg-white pb-2"
      style={{ borderColor: BORDER }}
    >
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-lg border text-sm font-semibold"
        style={{ borderColor: BORDER, color: NAVY }}
      >
        Cancel
      </button>
      <SubmitBtn
        loading={submitting}
        label={label}
        loadingLabel={loadingLabel}
      />
    </div>
  );
}

// ── Main page
export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >('ALL');
  const [addOpen, setAddOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [viewCompany, setViewCompany] = useState<CompanyDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const addForm = useForm<CompanyFormInput, any, CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  const editForm = useForm<CompanyFormInput, any, CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  const fetchCompanies = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const p = new URLSearchParams({
          page: String(page),
          limit: '15',
          ...(search && { search }),
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
        });
        const res = await api.get<{ data: Company[]; pagination: Pagination }>(
          `/api/admin/companies?${p}`
        );
        setCompanies(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        toast.error('Failed to load companies.');
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchCompanies(1), 350);
    return () => clearTimeout(t);
  }, [fetchCompanies]);

  // Create
  const onCreateSubmit = async (data: CompanyForm) => {
    setSubmitting(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
      );
      await api.post('/api/admin/companies', clean);
      toast.success('Company created.');
      addForm.reset();
      setAddOpen(false);
      fetchCompanies(1);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Failed to create company.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const openEdit = (company: Company) => {
    setMenuOpen(null);
    setEditCompany(company);
    editForm.reset({
      name: company.name,
      gstNumber: company.gstNumber ?? '',
      email: company.email ?? '',
      phone: company.phone ?? '',
      city: company.city ?? '',
      state: company.state ?? '',
      contractStart: company.contractStart
        ? format(new Date(company.contractStart), 'yyyy-MM-dd')
        : '',
      contractEnd: company.contractEnd
        ? format(new Date(company.contractEnd), 'yyyy-MM-dd')
        : '',
    });
  };
  const onEditSubmit = async (data: CompanyForm) => {
    if (!editCompany) return;
    setSubmitting(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
      );
      await api.patch(`/api/admin/companies/${editCompany.id}`, clean);
      toast.success('Company updated.');
      setEditCompany(null);
      fetchCompanies(pagination.page);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Failed to update.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle status
  const toggleStatus = async (company: Company) => {
    setMenuOpen(null);
    setTogglingId(company.id);
    const newStatus = company.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/api/admin/companies/${company.id}`, {
        status: newStatus,
      });
      toast.success(
        `Company ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}.`
      );
      fetchCompanies(pagination.page);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  // View detail
  const openView = async (company: Company) => {
    setMenuOpen(null);
    setViewLoading(true);
    setViewCompany(null);
    try {
      const res = await api.get<{ data: CompanyDetail }>(
        `/api/admin/companies/${company.id}`
      );
      setViewCompany(res.data.data);
    } catch {
      toast.error('Failed to load details.');
      setViewLoading(false);
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="space-y-4" onClick={() => menuOpen && setMenuOpen(null)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            Companies
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {pagination.total} corporate client
            {pagination.total !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => {
            addForm.reset();
            setAddOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
        >
          <Plus size={16} /> Add Company
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-3 flex items-center gap-3 flex-wrap"
        style={{ borderColor: BORDER }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <input
            type="text"
            placeholder="Search by name, email or GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-all"
            style={{ borderColor: BORDER, color: NAVY, background: BG }}
            onFocus={(e) => (e.target.style.borderColor = BRAND)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          />
        </div>
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: BG }}
        >
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
              style={{
                background: statusFilter === s ? '#fff' : 'transparent',
                color: statusFilter === s ? NAVY : MUTED,
                boxShadow:
                  statusFilter === s ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Active' : 'Inactive'}
            </button>
          ))}
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
                  'Company',
                  'GST Number',
                  'Contact',
                  'Location',
                  'Users',
                  'Bookings',
                  'Contract',
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
                  <td colSpan={9} className="py-16 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto"
                      style={{ color: BRAND }}
                    />
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Building2
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm" style={{ color: MUTED }}>
                      {search
                        ? 'No companies match your search.'
                        : 'No companies yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors"
                    style={{ borderColor: '#F0F2F5' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: '#EBF1FB',
                            color: BRAND,
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        >
                          {company.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-semibold text-xs leading-tight truncate max-w-[160px]"
                            style={{
                              color: NAVY,
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {company.name}
                          </p>
                          <p
                            className="text-xs truncate max-w-[160px]"
                            style={{ color: MUTED }}
                          >
                            {company.email ?? '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: company.gstNumber ? NAVY : MUTED }}
                      >
                        {company.gstNumber ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                      {company.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: NAVY }}>
                      {[company.city, company.state]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: MUTED }}
                      >
                        <Users size={12} />
                        {company._count.users}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: MUTED }}
                      >
                        <CalendarCheck size={12} />
                        {company._count.bookings}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {company.contractStart
                        ? format(new Date(company.contractStart), 'dd MMM yy')
                        : '—'}
                      {company.contractEnd && (
                        <span>
                          {' '}
                          → {format(new Date(company.contractEnd), 'dd MMM yy')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={company.status} />
                    </td>
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === company.id ? null : company.id
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpen === company.id && (
                        <div
                          className="absolute right-0 top-10 z-30 bg-white rounded-xl border shadow-lg py-1 min-w-[160px]"
                          style={{
                            borderColor: BORDER,
                            boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
                          }}
                        >
                          <button
                            onClick={() => openView(company)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                            style={{ color: NAVY }}
                          >
                            <Eye size={14} style={{ color: MUTED }} /> View
                            Details
                          </button>
                          <button
                            onClick={() => openEdit(company)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                            style={{ color: NAVY }}
                          >
                            <Pencil size={14} style={{ color: MUTED }} /> Edit
                          </button>
                          <div
                            className="my-1 border-t"
                            style={{ borderColor: BORDER }}
                          />
                          <button
                            onClick={() => toggleStatus(company)}
                            disabled={togglingId === company.id}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                            style={{
                              color:
                                company.status === 'ACTIVE'
                                  ? '#DC2626'
                                  : '#059669',
                            }}
                          >
                            {togglingId === company.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : company.status === 'ACTIVE' ? (
                              <ToggleLeft size={14} />
                            ) : (
                              <ToggleRight size={14} />
                            )}
                            {company.status === 'ACTIVE'
                              ? 'Deactivate'
                              : 'Activate'}
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
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchCompanies(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: MUTED }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - pagination.page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchCompanies(p)}
                    className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: p === pagination.page ? BRAND : 'transparent',
                      color: p === pagination.page ? '#fff' : MUTED,
                    }}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => fetchCompanies(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: MUTED }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Drawer */}
      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Company"
      >
        <form onSubmit={addForm.handleSubmit(onCreateSubmit)}>
          <CompanyFormFields form={addForm} />
          <DrawerFooter
            onCancel={() => setAddOpen(false)}
            submitting={submitting}
            label="Create Company"
            loadingLabel="Creating..."
          />
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        open={!!editCompany}
        onClose={() => setEditCompany(null)}
        title={`Edit — ${editCompany?.name ?? ''}`}
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
          <CompanyFormFields form={editForm} />
          <DrawerFooter
            onCancel={() => setEditCompany(null)}
            submitting={submitting}
            label="Save Changes"
            loadingLabel="Saving..."
          />
        </form>
      </Drawer>

      {/* View Drawer */}
      <Drawer
        open={!!viewCompany || viewLoading}
        onClose={() => setViewCompany(null)}
        title="Company Details"
        width={520}
      >
        {viewLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: BRAND }}
            />
          </div>
        ) : viewCompany ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: '#EBF1FB',
                  color: BRAND,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {viewCompany.name.charAt(0)}
              </div>
              <div>
                <p
                  className="font-semibold text-base"
                  style={{ color: NAVY, fontFamily: 'Poppins, sans-serif' }}
                >
                  {viewCompany.name}
                </p>
                <div className="mt-1">
                  <StatusBadge status={viewCompany.status} />
                </div>
              </div>
            </div>

            {[
              { label: 'GST Number', value: viewCompany.gstNumber },
              { label: 'PAN', value: viewCompany.pan },
              { label: 'Email', value: viewCompany.email },
              { label: 'Phone', value: viewCompany.phone },
              { label: 'Address', value: viewCompany.address },
              {
                label: 'City / State',
                value:
                  [viewCompany.city, viewCompany.state]
                    .filter(Boolean)
                    .join(', ') || null,
              },
              { label: 'Pincode', value: viewCompany.pincode },
              {
                label: 'Credit Limit',
                value: viewCompany.creditLimit
                  ? `₹${Number(viewCompany.creditLimit).toLocaleString(
                      'en-IN'
                    )}`
                  : null,
              },
              {
                label: 'Contract Start',
                value: viewCompany.contractStart
                  ? format(new Date(viewCompany.contractStart), 'dd MMM yyyy')
                  : null,
              },
              {
                label: 'Contract End',
                value: viewCompany.contractEnd
                  ? format(new Date(viewCompany.contractEnd), 'dd MMM yyyy')
                  : null,
              },
              {
                label: 'Joined',
                value: format(new Date(viewCompany.createdAt), 'dd MMM yyyy'),
              },
            ]
              .filter((r) => r.value)
              .map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-1.5 border-b"
                  style={{ borderColor: '#F0F2F5' }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: MUTED }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs font-semibold text-right max-w-[60%]"
                    style={{ color: NAVY }}
                  >
                    {value}
                  </span>
                </div>
              ))}

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#EBF1FB' }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: BRAND, fontFamily: 'Poppins, sans-serif' }}
                >
                  {viewCompany._count.bookings}
                </p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                  Total Bookings
                </p>
              </div>
              <div
                className="rounded-xl p-4 text-center"
                style={{ background: '#F3F4F6' }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: NAVY, fontFamily: 'Poppins, sans-serif' }}
                >
                  {viewCompany.users.length}
                </p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                  Users
                </p>
              </div>
            </div>

            {viewCompany.users.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                  Users ({viewCompany.users.length})
                </p>
                <div className="space-y-2">
                  {viewCompany.users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                      style={{ borderColor: BORDER }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: '#EBF1FB',
                          color: BRAND,
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: NAVY }}
                        >
                          {u.name}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: MUTED }}
                        >
                          {u.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: '#EBF1FB', color: BRAND }}
                        >
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                        <span
                          className="text-[10px] font-medium"
                          style={{
                            color:
                              u.status === 'ACTIVE' ? '#059669' : '#9CA3AF',
                          }}
                        >
                          {u.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setViewCompany(null);
                openEdit(viewCompany);
              }}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
            >
              <Pencil size={14} /> Edit Company
            </button>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
