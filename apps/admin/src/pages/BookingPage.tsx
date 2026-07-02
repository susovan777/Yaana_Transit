// Path: apps/admin/src/pages/BookingsPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  ArrowRight,
  Loader2,
  CalendarCheck,
  Car,
  User,
  Building2,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

type BookingStatus =
  | 'ENQUIRY'
  | 'CONFIRMED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';
type ServiceType =
  | 'CHAUFFEUR_DRIVEN'
  | 'AIRPORT_TRANSFER'
  | 'OUTSTATION'
  | 'ETS'
  | 'EVENTS'
  | 'CORPORATE_LEASE';

type Booking = {
  id: string;
  referenceNo: string;
  status: BookingStatus;
  serviceType: ServiceType;
  startDate: string;
  endDate: string | null;
  pickupAddress: string | null;
  dropAddress: string | null;
  passengerCount: number | null;
  notes: string | null;
  adminNotes: string | null;
  quotedAmount: number | null;
  finalAmount: number | null;
  chauffeurName: string | null;
  chauffeurPhone: string | null;
  createdAt: string;
  updatedAt: string;
  company: { id: string; name: string; gstNumber: string | null } | null;
  user: { id: string; name: string; email: string } | null;
  pickupCity: { id: string; name: string; state: string } | null;
  vehicle: {
    id: string;
    name: string;
    category: string;
    registration: string | null;
  } | null;
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    total: number;
  } | null;
};

type Company = { id: string; name: string };
type Vehicle = {
  id: string;
  name: string;
  category: string;
  registration: string | null;
};
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
  BookingStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ElementType;
    next: BookingStatus[];
  }
> = {
  ENQUIRY: {
    label: 'Enquiry',
    color: '#92400E',
    bg: '#FEF3C7',
    icon: Clock,
    next: ['CONFIRMED', 'CANCELLED'],
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#1D4ED8',
    bg: '#DBEAFE',
    icon: CalendarCheck,
    next: ['ONGOING', 'CANCELLED'],
  },
  ONGOING: {
    label: 'Ongoing',
    color: '#065F46',
    bg: '#D1FAE5',
    icon: Car,
    next: ['COMPLETED', 'CANCELLED'],
  },
  COMPLETED: {
    label: 'Completed',
    color: '#374151',
    bg: '#F3F4F6',
    icon: CheckCircle2,
    next: [],
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#991B1B',
    bg: '#FEE2E2',
    icon: Ban,
    next: [],
  },
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  CHAUFFEUR_DRIVEN: 'Chauffeur Driven',
  AIRPORT_TRANSFER: 'Airport Transfer',
  OUTSTATION: 'Outstation',
  ETS: 'ETS',
  EVENTS: 'Events',
  CORPORATE_LEASE: 'Corporate Lease',
};

const SERVICE_OPTIONS = Object.entries(SERVICE_LABELS) as [
  ServiceType,
  string
][];

// ── Helpers ───────────────────────────────────────────────────────────

function inr(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n));
}
function apiErr(e: unknown, fallback: string) {
  return (
    (e as { response?: { data?: { error?: { message?: string } } } })?.response
      ?.data?.error?.message ?? fallback
  );
}

// ── UI atoms ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BookingStatus }) {
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

function FSelect({
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
      style={{ borderColor: error ? '#EF4444' : BORDER, color: NAVY }}
      onFocus={(e) => (e.target.style.borderColor = BRAND)}
      onBlur={(e) => (e.target.style.borderColor = error ? '#EF4444' : BORDER)}
    >
      {children}
    </select>
  );
}

function Textarea({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
      style={{ borderColor: BORDER, color: NAVY, background: '#fff' }}
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
  width = 520,
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

// ── Zod schemas ───────────────────────────────────────────────────────

const createSchema = z.object({
  companyId: z.string().min(1, 'Company required'),
  userId: z.string().min(1, 'User required'),
  serviceType: z.enum(
    [
      'CHAUFFEUR_DRIVEN',
      'AIRPORT_TRANSFER',
      'OUTSTATION',
      'ETS',
      'EVENTS',
      'CORPORATE_LEASE',
    ] as [ServiceType, ...ServiceType[]],
    { error: 'Service required' }
  ),
  pickupAddress: z.string().optional(),
  dropAddress: z.string().optional(),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  passengerCount: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .or(z.literal('')),
  vehicleId: z.string().optional(),
  chauffeurName: z.string().optional(),
  chauffeurPhone: z.string().optional(),
  quotedAmount: z.coerce.number().positive().optional().or(z.literal('')),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
});

const editSchema = createSchema.omit({ companyId: true, userId: true }).extend({
  finalAmount: z.coerce.number().positive().optional().or(z.literal('')),
});

const statusSchema = z.object({
  status: z.enum([
    'ENQUIRY',
    'CONFIRMED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED',
  ] as [BookingStatus, ...BookingStatus[]]),
  finalAmount: z.coerce.number().positive().optional().or(z.literal('')),
  adminNotes: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;
type StatusForm = z.infer<typeof statusSchema>;

// ── Status workflow stepper ───────────────────────────────────────────

const WORKFLOW: BookingStatus[] = [
  'ENQUIRY',
  'CONFIRMED',
  'ONGOING',
  'COMPLETED',
];

function WorkflowStepper({ current }: { current: BookingStatus }) {
  if (current === 'CANCELLED')
    return (
      <div
        className="flex items-center gap-2 p-3 rounded-lg"
        style={{ background: '#FEE2E2' }}
      >
        <Ban size={16} style={{ color: '#991B1B' }} />
        <span className="text-sm font-semibold" style={{ color: '#991B1B' }}>
          Booking Cancelled
        </span>
      </div>
    );
  const currentIdx = WORKFLOW.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {WORKFLOW.map((s, idx) => {
        const cfg = STATUS_CONFIG[s];
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`flex-1 flex flex-col items-center gap-1`}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done || active ? cfg.color : '#E5E7EB',
                  color: done || active ? '#fff' : '#9CA3AF',
                }}
              >
                {done ? '✓' : idx + 1}
              </div>
              <span
                className="text-[10px] font-medium text-center leading-tight"
                style={{
                  color: active ? cfg.color : done ? '#374151' : '#9CA3AF',
                }}
              >
                {cfg.label}
              </span>
            </div>
            {idx < WORKFLOW.length - 1 && (
              <div
                className="h-0.5 flex-1 mb-4 transition-all"
                style={{ background: done ? BRAND : '#E5E7EB' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Detail section ────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div
      className="flex items-start gap-3 py-2 border-b"
      style={{ borderColor: '#F0F2F5' }}
    >
      <Icon size={14} style={{ color: MUTED, marginTop: 2, flexShrink: 0 }} />
      <div>
        <p className="text-xs" style={{ color: MUTED }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: NAVY }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companyUsers, setCompanyUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>(
    'ALL'
  );
  const [companyFilter, setCompanyFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Drawers
  const [addOpen, setAddOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [statusBooking, setStatusBooking] = useState<Booking | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema as any),
  });
  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema as any),
  });
  const statusForm = useForm<StatusForm>({
    resolver: zodResolver(statusSchema as any),
  });

  const watchCompany = addForm.watch('companyId');

  // Load companies + vehicles once
  useEffect(() => {
    Promise.all([
      api.get<{ data: Company[] }>(
        '/api/admin/companies?limit=100&status=ACTIVE'
      ),
      api.get<{ data: Vehicle[] }>('/api/admin/fleet?limit=100&active=true'),
    ])
      .then(([c, v]) => {
        setCompanies(c.data.data);
        setVehicles(v.data.data);
      })
      .catch(() => {});
  }, []);

  // Load users when company selected in add form
  useEffect(() => {
    if (!watchCompany) {
      setCompanyUsers([]);
      return;
    }
    api
      .get<{ data: { id: string; name: string; email: string }[] }>(
        `/api/admin/users?companyId=${watchCompany}&limit=100`
      )
      .then((r) => setCompanyUsers(r.data.data))
      .catch(() => {});
  }, [watchCompany]);

  // Fetch bookings
  const fetchBookings = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const p = new URLSearchParams({
          page: String(page),
          limit: '15',
          ...(search && { search }),
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
          ...(companyFilter && { companyId: companyFilter }),
          ...(serviceFilter && { service: serviceFilter }),
          ...(dateFrom && { dateFrom }),
          ...(dateTo && { dateTo }),
        });
        const res = await api.get<{ data: Booking[]; pagination: Pagination }>(
          `/api/admin/bookings?${p}`
        );
        setBookings(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        toast.error('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, companyFilter, serviceFilter, dateFrom, dateTo]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchBookings(1), 350);
    return () => clearTimeout(t);
  }, [fetchBookings]);

  // ── Create
  const onCreateSubmit = async (data: CreateForm) => {
    setSubmitting(true);
    try {
      const clean = {
        ...data,
        passengerCount: data.passengerCount || undefined,
        quotedAmount: data.quotedAmount || undefined,
        vehicleId: data.vehicleId || undefined,
        pickupAddress: data.pickupAddress || undefined,
        dropAddress: data.dropAddress || undefined,
        endDate: data.endDate || undefined,
        notes: data.notes || undefined,
        adminNotes: data.adminNotes || undefined,
        chauffeurName: data.chauffeurName || undefined,
        chauffeurPhone: data.chauffeurPhone || undefined,
      };
      await api.post('/api/admin/bookings', clean);
      toast.success('Booking created.');
      addForm.reset();
      setAddOpen(false);
      fetchBookings(1);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to create.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit
  const openEdit = (b: Booking) => {
    setMenuOpen(null);
    setDetailBooking(null);
    setEditBooking(b);
    editForm.reset({
      serviceType: b.serviceType,
      pickupAddress: b.pickupAddress ?? '',
      dropAddress: b.dropAddress ?? '',
      startDate: format(new Date(b.startDate), 'yyyy-MM-dd'),
      endDate: b.endDate ? format(new Date(b.endDate), 'yyyy-MM-dd') : '',
      passengerCount: b.passengerCount ?? ('' as unknown as number),
      vehicleId: b.vehicle?.id ?? '',
      chauffeurName: b.chauffeurName ?? '',
      chauffeurPhone: b.chauffeurPhone ?? '',
      quotedAmount: b.quotedAmount
        ? Number(b.quotedAmount)
        : ('' as unknown as number),
      finalAmount: b.finalAmount
        ? Number(b.finalAmount)
        : ('' as unknown as number),
      notes: b.notes ?? '',
      adminNotes: b.adminNotes ?? '',
    });
  };

  const onEditSubmit = async (data: EditForm) => {
    if (!editBooking) return;
    setSubmitting(true);
    try {
      const clean = {
        ...data,
        vehicleId: data.vehicleId || null,
        passengerCount: data.passengerCount || null,
        quotedAmount: data.quotedAmount || null,
        finalAmount: data.finalAmount || null,
        endDate: data.endDate || null,
      };
      await api.patch(`/api/admin/bookings/${editBooking.id}`, clean);
      toast.success('Booking updated.');
      setEditBooking(null);
      fetchBookings(pagination.page);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to update.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Status transition
  const openStatus = (b: Booking) => {
    setMenuOpen(null);
    setDetailBooking(null);
    setStatusBooking(b);
    statusForm.reset({ status: STATUS_CONFIG[b.status].next[0] ?? b.status });
  };

  const onStatusSubmit = async (data: StatusForm) => {
    if (!statusBooking) return;
    setSubmitting(true);
    try {
      await api.patch(`/api/admin/bookings/${statusBooking.id}/status`, {
        status: data.status,
        finalAmount: data.finalAmount || undefined,
        adminNotes: data.adminNotes || undefined,
      });
      toast.success(`Status updated to ${data.status}.`);
      setStatusBooking(null);
      fetchBookings(pagination.page);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to update status.'));
    } finally {
      setSubmitting(false);
    }
  };

  const watchNewStatus = statusForm.watch('status');

  // ── UI
  const DrawerFooter = ({
    onCancel,
    label,
    loadingLabel,
  }: {
    onCancel: () => void;
    label: string;
    loadingLabel: string;
  }) => (
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
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ? loadingLabel : label}
      </button>
    </div>
  );

  const VehicleFields = ({
    form,
  }: {
    form:
      | ReturnType<typeof useForm<EditForm>>
      | ReturnType<typeof useForm<CreateForm>>;
  }) => (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Vehicle">
          <FSelect
            {...(form as ReturnType<typeof useForm<EditForm>>).register(
              'vehicleId'
            )}
          >
            <option value="">No vehicle assigned</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
                {v.registration ? ` (${v.registration})` : ''}
              </option>
            ))}
          </FSelect>
        </Field>
        <Field label="Passengers">
          <Input
            type="number"
            min={1}
            max={100}
            placeholder="4"
            {...(form as ReturnType<typeof useForm<EditForm>>).register(
              'passengerCount'
            )}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Chauffeur Name">
          <Input
            placeholder="Ramesh Yadav"
            {...(form as ReturnType<typeof useForm<EditForm>>).register(
              'chauffeurName'
            )}
          />
        </Field>
        <Field label="Chauffeur Phone">
          <Input
            placeholder="+91 98001 11001"
            {...(form as ReturnType<typeof useForm<EditForm>>).register(
              'chauffeurPhone'
            )}
          />
        </Field>
      </div>
    </>
  );

  return (
    <div className="space-y-4" onClick={() => menuOpen && setMenuOpen(null)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            Bookings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {pagination.total} booking{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => {
            addForm.reset();
            setAddOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
          style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
        >
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-3 space-y-2"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: MUTED }}
            />
            <input
              type="text"
              placeholder="Search by ref no., company, chauffeur…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: BORDER, color: NAVY, background: BG }}
              onFocus={(e) => (e.target.style.borderColor = BRAND)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            />
          </div>

          {/* Company filter */}
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

          {/* Service filter */}
          <select
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(e.target.value as ServiceType | '')
            }
            className="px-3 py-2 rounded-lg border text-sm outline-none"
            style={{
              borderColor: BORDER,
              color: serviceFilter ? NAVY : MUTED,
              background: BG,
            }}
          >
            <option value="">All Services</option>
            {SERVICE_OPTIONS.map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Status tabs + date range */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-1 p-1 rounded-lg flex-1 overflow-x-auto"
            style={{ background: BG }}
          >
            {(
              [
                'ALL',
                'ENQUIRY',
                'CONFIRMED',
                'ONGOING',
                'COMPLETED',
                'CANCELLED',
              ] as const
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
                      statusFilter === s
                        ? '0 1px 3px rgba(0,0,0,0.08)'
                        : 'none',
                  }}
                >
                  {isAll ? 'All' : cfg!.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: BORDER, color: NAVY, background: BG }}
            />
            <span className="text-xs" style={{ color: MUTED }}>
              to
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-2 rounded-lg border text-xs outline-none"
              style={{ borderColor: BORDER, color: NAVY, background: BG }}
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                style={{ color: MUTED }}
              >
                <X size={14} />
              </button>
            )}
          </div>
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
                  'Ref No.',
                  'Company',
                  'Service',
                  'Dates',
                  'Vehicle',
                  'Chauffeur',
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
                  <td colSpan={9} className="py-16 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto"
                      style={{ color: BRAND }}
                    />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <CalendarCheck
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm" style={{ color: MUTED }}>
                      No bookings found.
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    style={{ borderColor: '#F0F2F5' }}
                    onClick={() => setDetailBooking(b)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: BRAND }}
                      >
                        {b.referenceNo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="text-xs font-semibold truncate max-w-[130px]"
                        style={{ color: NAVY }}
                      >
                        {b.company?.name ?? '—'}
                      </p>
                      <p
                        className="text-xs truncate max-w-[130px]"
                        style={{ color: MUTED }}
                      >
                        {b.user?.name ?? '—'}
                      </p>
                    </td>
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: NAVY }}
                    >
                      {SERVICE_LABELS[b.serviceType]}
                    </td>
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {format(new Date(b.startDate), 'dd MMM yy')}
                      {b.endDate && (
                        <span className="block">
                          {format(new Date(b.endDate), 'dd MMM yy')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: NAVY }}>
                      {b.vehicle ? (
                        <span className="truncate max-w-[100px] block">
                          {b.vehicle.name}
                        </span>
                      ) : (
                        <span style={{ color: MUTED }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: NAVY }}>
                      {b.chauffeurName ?? (
                        <span style={{ color: MUTED }}>—</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-xs font-medium whitespace-nowrap"
                      style={{ color: NAVY }}
                    >
                      {b.finalAmount ? (
                        inr(Number(b.finalAmount))
                      ) : b.quotedAmount ? (
                        <span style={{ color: MUTED }}>
                          ~{inr(Number(b.quotedAmount))}
                        </span>
                      ) : (
                        <span style={{ color: MUTED }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === b.id ? null : b.id)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpen === b.id && (
                        <div
                          className="absolute right-0 top-10 z-30 bg-white rounded-xl border shadow-lg py-1 min-w-[170px]"
                          style={{
                            borderColor: BORDER,
                            boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
                          }}
                        >
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              setDetailBooking(b);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                            style={{ color: NAVY }}
                          >
                            <FileText size={14} style={{ color: MUTED }} /> View
                            Details
                          </button>
                          {!['COMPLETED', 'CANCELLED'].includes(b.status) && (
                            <button
                              onClick={() => openEdit(b)}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                              style={{ color: NAVY }}
                            >
                              <Pencil size={14} style={{ color: MUTED }} /> Edit
                              Booking
                            </button>
                          )}
                          {STATUS_CONFIG[b.status].next.length > 0 && (
                            <button
                              onClick={() => openStatus(b)}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                              style={{ color: BRAND }}
                            >
                              <ArrowRight size={14} /> Update Status
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                onClick={() => fetchBookings(pagination.page - 1)}
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
                    onClick={() => fetchBookings(p)}
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
                onClick={() => fetchBookings(pagination.page + 1)}
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
        open={!!detailBooking}
        onClose={() => setDetailBooking(null)}
        title="Booking Details"
        width={560}
      >
        {detailBooking && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="font-mono text-lg font-bold"
                  style={{ color: BRAND }}
                >
                  {detailBooking.referenceNo}
                </p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                  Created{' '}
                  {format(
                    new Date(detailBooking.createdAt),
                    'dd MMM yyyy, h:mm a'
                  )}
                </p>
              </div>
              <StatusBadge status={detailBooking.status} />
            </div>

            {/* Workflow stepper */}
            <div
              className="p-4 rounded-xl border"
              style={{ borderColor: BORDER }}
            >
              <WorkflowStepper current={detailBooking.status} />
            </div>

            {/* Details */}
            <div className="space-y-0">
              <DetailRow
                icon={Building2}
                label="Company"
                value={detailBooking.company?.name}
              />
              <DetailRow
                icon={User}
                label="Booked by"
                value={`${detailBooking.user?.name} (${detailBooking.user?.email})`}
              />
              <DetailRow
                icon={CalendarCheck}
                label="Service"
                value={SERVICE_LABELS[detailBooking.serviceType]}
              />
              <DetailRow
                icon={MapPin}
                label="Pickup City"
                value={
                  detailBooking.pickupCity
                    ? `${detailBooking.pickupCity.name}, ${detailBooking.pickupCity.state}`
                    : null
                }
              />
              <DetailRow
                icon={MapPin}
                label="Pickup Address"
                value={detailBooking.pickupAddress}
              />
              <DetailRow
                icon={MapPin}
                label="Drop Address"
                value={detailBooking.dropAddress}
              />
              <DetailRow
                icon={CalendarCheck}
                label="Start Date"
                value={format(new Date(detailBooking.startDate), 'dd MMM yyyy')}
              />
              {detailBooking.endDate && (
                <DetailRow
                  icon={CalendarCheck}
                  label="End Date"
                  value={format(new Date(detailBooking.endDate), 'dd MMM yyyy')}
                />
              )}
              <DetailRow
                icon={User}
                label="Passengers"
                value={
                  detailBooking.passengerCount
                    ? String(detailBooking.passengerCount)
                    : null
                }
              />
              <DetailRow
                icon={Car}
                label="Vehicle"
                value={
                  detailBooking.vehicle
                    ? `${detailBooking.vehicle.name}${
                        detailBooking.vehicle.registration
                          ? ` (${detailBooking.vehicle.registration})`
                          : ''
                      }`
                    : null
                }
              />
              <DetailRow
                icon={User}
                label="Chauffeur"
                value={detailBooking.chauffeurName}
              />
              <DetailRow
                icon={Phone}
                label="Chauffeur Ph."
                value={detailBooking.chauffeurPhone}
              />
            </div>

            {/* Financials */}
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
                  Financials
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                {detailBooking.quotedAmount && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: MUTED }}>Quoted Amount</span>
                    <span style={{ color: NAVY }}>
                      {inr(Number(detailBooking.quotedAmount))}
                    </span>
                  </div>
                )}
                {detailBooking.finalAmount && (
                  <div className="flex justify-between text-sm font-semibold">
                    <span style={{ color: NAVY }}>Final Amount</span>
                    <span style={{ color: BRAND }}>
                      {inr(Number(detailBooking.finalAmount))}
                    </span>
                  </div>
                )}
                {detailBooking.invoice && (
                  <div
                    className="flex justify-between text-sm pt-2 border-t"
                    style={{ borderColor: BORDER }}
                  >
                    <span style={{ color: MUTED }}>Invoice</span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: BRAND }}
                    >
                      {detailBooking.invoice.invoiceNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {(detailBooking.notes || detailBooking.adminNotes) && (
              <div className="space-y-3">
                {detailBooking.notes && (
                  <div className="p-3 rounded-lg" style={{ background: BG }}>
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: MUTED }}
                    >
                      Client Notes
                    </p>
                    <p className="text-sm" style={{ color: NAVY }}>
                      {detailBooking.notes}
                    </p>
                  </div>
                )}
                {detailBooking.adminNotes && (
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: '#FEF3C7' }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: '#92400E' }}
                    >
                      Admin Notes
                    </p>
                    <p className="text-sm" style={{ color: '#78350F' }}>
                      {detailBooking.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {!['COMPLETED', 'CANCELLED'].includes(detailBooking.status) && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => openEdit(detailBooking)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold"
                  style={{ borderColor: BORDER, color: NAVY }}
                >
                  <Pencil size={14} /> Edit
                </button>
                {STATUS_CONFIG[detailBooking.status].next.length > 0 && (
                  <button
                    onClick={() => openStatus(detailBooking)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: BRAND }}
                  >
                    <ArrowRight size={14} /> Update Status
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ── Add Drawer */}
      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New Booking"
      >
        <form onSubmit={addForm.handleSubmit(onCreateSubmit)}>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Client
              </p>
              <div className="space-y-3">
                <Field
                  label="Company"
                  error={addForm.formState.errors.companyId?.message}
                  required
                >
                  <FSelect
                    {...addForm.register('companyId')}
                    error={addForm.formState.errors.companyId?.message}
                  >
                    <option value="">Select company…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </FSelect>
                </Field>
                <Field
                  label="User (Booked By)"
                  error={addForm.formState.errors.userId?.message}
                  required
                >
                  <FSelect
                    {...addForm.register('userId')}
                    error={addForm.formState.errors.userId?.message}
                    disabled={!watchCompany}
                  >
                    <option value="">
                      {watchCompany ? 'Select user…' : 'Select a company first'}
                    </option>
                    {companyUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </FSelect>
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Trip Details
              </p>
              <div className="space-y-3">
                <Field
                  label="Service Type"
                  error={addForm.formState.errors.serviceType?.message}
                  required
                >
                  <FSelect
                    {...addForm.register('serviceType')}
                    error={addForm.formState.errors.serviceType?.message}
                  >
                    <option value="">Select service…</option>
                    {SERVICE_OPTIONS.map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </FSelect>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Start Date"
                    error={addForm.formState.errors.startDate?.message}
                    required
                  >
                    <Input
                      type="date"
                      {...addForm.register('startDate')}
                      error={addForm.formState.errors.startDate?.message}
                    />
                  </Field>
                  <Field label="End Date">
                    <Input type="date" {...addForm.register('endDate')} />
                  </Field>
                </div>
                <Field label="Pickup Address">
                  <Input
                    placeholder="Terminal 2, CSIA Mumbai"
                    {...addForm.register('pickupAddress')}
                  />
                </Field>
                <Field label="Drop Address">
                  <Input
                    placeholder="BKC, Mumbai"
                    {...addForm.register('dropAddress')}
                  />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Assignment
              </p>
              <div className="space-y-3">
                <VehicleFields
                  form={
                    addForm as unknown as ReturnType<typeof useForm<EditForm>>
                  }
                />
                <Field label="Quoted Amount (₹)">
                  <Input
                    type="number"
                    placeholder="8500"
                    {...addForm.register('quotedAmount')}
                  />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Notes
              </p>
              <div className="space-y-3">
                <Field label="Client Notes">
                  <Textarea
                    placeholder="Special requirements from client…"
                    {...addForm.register('notes')}
                  />
                </Field>
                <Field label="Admin Notes (Internal)">
                  <Textarea
                    placeholder="Internal notes — not visible to client"
                    {...addForm.register('adminNotes')}
                  />
                </Field>
              </div>
            </div>
          </div>
          <DrawerFooter
            onCancel={() => setAddOpen(false)}
            label="Create Booking"
            loadingLabel="Creating…"
          />
        </form>
      </Drawer>

      {/* ── Edit Drawer */}
      <Drawer
        open={!!editBooking}
        onClose={() => setEditBooking(null)}
        title={`Edit — ${editBooking?.referenceNo ?? ''}`}
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Trip Details
              </p>
              <div className="space-y-3">
                <Field label="Service Type">
                  <FSelect {...editForm.register('serviceType')}>
                    {SERVICE_OPTIONS.map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </FSelect>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date">
                    <Input type="date" {...editForm.register('startDate')} />
                  </Field>
                  <Field label="End Date">
                    {' '}
                    <Input type="date" {...editForm.register('endDate')} />
                  </Field>
                </div>
                <Field label="Pickup Address">
                  <Input
                    placeholder="Terminal 2, CSIA Mumbai"
                    {...editForm.register('pickupAddress')}
                  />
                </Field>
                <Field label="Drop Address">
                  {' '}
                  <Input
                    placeholder="BKC, Mumbai"
                    {...editForm.register('dropAddress')}
                  />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Assignment
              </p>
              <div className="space-y-3">
                <VehicleFields form={editForm} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Financials
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Quoted Amount (₹)">
                  <Input
                    type="number"
                    placeholder="8500"
                    {...editForm.register('quotedAmount')}
                  />
                </Field>
                <Field label="Final Amount (₹)">
                  {' '}
                  <Input
                    type="number"
                    placeholder="9200"
                    {...editForm.register('finalAmount')}
                  />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Notes
              </p>
              <div className="space-y-3">
                <Field label="Client Notes">
                  {' '}
                  <Textarea {...editForm.register('notes')} />
                </Field>
                <Field label="Admin Notes (Internal)">
                  <Textarea {...editForm.register('adminNotes')} />
                </Field>
              </div>
            </div>
          </div>
          <DrawerFooter
            onCancel={() => setEditBooking(null)}
            label="Save Changes"
            loadingLabel="Saving…"
          />
        </form>
      </Drawer>

      {/* ── Status Drawer */}
      <Drawer
        open={!!statusBooking}
        onClose={() => setStatusBooking(null)}
        title="Update Status"
        width={420}
      >
        {statusBooking && (
          <form onSubmit={statusForm.handleSubmit(onStatusSubmit)}>
            <div className="space-y-5">
              {/* Current status */}
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: BG }}
              >
                <div>
                  <p className="text-xs" style={{ color: MUTED }}>
                    Current Status
                  </p>
                  <StatusBadge status={statusBooking.status} />
                </div>
                <ArrowRight size={16} style={{ color: MUTED }} />
                <div>
                  <p className="text-xs mb-1" style={{ color: MUTED }}>
                    Move to
                  </p>
                  {watchNewStatus && (
                    <StatusBadge status={watchNewStatus as BookingStatus} />
                  )}
                </div>
              </div>

              {/* Target status select */}
              <Field label="New Status" required>
                <FSelect {...statusForm.register('status')}>
                  {STATUS_CONFIG[statusBooking.status].next.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </FSelect>
              </Field>

              {/* Rules hint */}
              {statusBooking.status === 'ENQUIRY' &&
                watchNewStatus === 'CONFIRMED' && (
                  <div
                    className="flex gap-2 p-3 rounded-lg text-xs"
                    style={{ background: '#DBEAFE', color: '#1D4ED8' }}
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>
                      Vehicle and chauffeur name must be set on the booking
                      before confirming.
                    </span>
                  </div>
                )}
              {watchNewStatus === 'COMPLETED' && (
                <Field label="Final Amount (₹)" required>
                  <Input
                    type="number"
                    placeholder="9200"
                    {...statusForm.register('finalAmount')}
                  />
                  <p className="text-xs mt-1" style={{ color: MUTED }}>
                    Required to generate invoice after completion.
                  </p>
                </Field>
              )}
              {watchNewStatus === 'CANCELLED' && (
                <div
                  className="flex gap-2 p-3 rounded-lg text-xs"
                  style={{ background: '#FEE2E2', color: '#991B1B' }}
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Cancelling is irreversible. Add a reason in admin notes
                    below.
                  </span>
                </div>
              )}

              {/* Admin notes */}
              <Field label="Admin Notes (optional)">
                <Textarea
                  placeholder="Reason for status change, internal notes…"
                  {...statusForm.register('adminNotes')}
                />
              </Field>
            </div>
            <DrawerFooter
              onCancel={() => setStatusBooking(null)}
              label="Update Status"
              loadingLabel="Updating…"
            />
          </form>
        )}
      </Drawer>
    </div>
  );
}
