// Path: apps/admin/src/pages/FleetPage.tsx

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Car,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  seats: number;
  registration: string | null;
  year: number | null;
  color: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  baseCity: { id: string; name: string; state: string } | null;
  _count: { bookings: number };
};

type City = { id: string; name: string; state: string };

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type VehicleCategory =
  | 'SEDAN'
  | 'MUV'
  | 'SUV'
  | 'PREMIUM_SUV'
  | 'PREMIUM'
  | 'LUXURY';

// ── Config ────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  VehicleCategory,
  { label: string; color: string; bg: string }
> = {
  SEDAN: { label: 'Sedan', color: '#1D4ED8', bg: '#DBEAFE' },
  MUV: { label: 'MUV', color: '#065F46', bg: '#D1FAE5' },
  SUV: { label: 'SUV', color: '#7C3AED', bg: '#EDE9FE' },
  PREMIUM_SUV: { label: 'Premium SUV', color: '#B45309', bg: '#FEF3C7' },
  PREMIUM: { label: 'Premium', color: '#0E7490', bg: '#CFFAFE' },
  LUXURY: { label: 'Luxury', color: '#9D174D', bg: '#FCE7F3' },
};

const CATEGORIES = Object.entries(CATEGORY_CONFIG) as [
  VehicleCategory,
  (typeof CATEGORY_CONFIG)[VehicleCategory]
][];

const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';
const BG = '#F7F9FC';

// ── Zod schema ────────────────────────────────────────────────────────

const vehicleSchema = z.object({
  name: z.string().min(2, 'Name required'),
  category: z.enum(
    ['SEDAN', 'MUV', 'SUV', 'PREMIUM_SUV', 'PREMIUM', 'LUXURY'],
    {
      error: 'Category required',
    }
  ),
  seats: z.coerce.number().int().min(1, 'Min 1').max(50, 'Max 50'),
  registration: z
    .string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, 'Format: MH01AB1234')
    .or(z.literal(''))
    .optional(),
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .optional()
    .or(z.literal('')),
  color: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  baseCityId: z.string().optional(),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

// ── Helpers ───────────────────────────────────────────────────────────

function apiErr(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { error?: { message?: string } } } })
      ?.response?.data?.error?.message ?? fallback
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: VehicleCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: active ? '#D1FAE5' : '#F3F4F6',
        color: active ? '#065F46' : '#6B7280',
      }}
    >
      {active ? <CheckCircle2 size={11} /> : <X size={11} />}
      {active ? 'Active' : 'Inactive'}
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

function Select({
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all bg-white"
      style={{ borderColor: error ? '#EF4444' : BORDER, color: NAVY }}
      onFocus={(e) => {
        (e.target as HTMLSelectElement).style.borderColor = BRAND;
      }}
      onBlur={(e) => {
        (e.target as HTMLSelectElement).style.borderColor = error
          ? '#EF4444'
          : BORDER;
      }}
    >
      {children}
    </select>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────

function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
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
        className={`fixed top-0 right-0 h-full w-full max-w-[460px] z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
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

// ── Delete confirm modal ──────────────────────────────────────────────

function DeleteModal({
  vehicle,
  onConfirm,
  onCancel,
  loading,
}: {
  vehicle: Vehicle;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const hasBookings = vehicle._count.bookings > 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(11,31,58,0.5)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: hasBookings ? '#FEF3C7' : '#FEE2E2' }}
        >
          <AlertTriangle
            size={22}
            style={{ color: hasBookings ? '#D97706' : '#DC2626' }}
          />
        </div>
        <h3
          className="text-base font-semibold text-center mb-2"
          style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
        >
          {hasBookings ? 'Cannot Delete Vehicle' : 'Delete Vehicle?'}
        </h3>
        {hasBookings ? (
          <p className="text-sm text-center mb-5" style={{ color: MUTED }}>
            <strong>{vehicle.name}</strong> has {vehicle._count.bookings}{' '}
            booking{vehicle._count.bookings > 1 ? 's' : ''} on record. You
            cannot delete it — deactivate it instead to remove it from active
            use.
          </p>
        ) : (
          <p className="text-sm text-center mb-5" style={{ color: MUTED }}>
            This will permanently delete <strong>{vehicle.name}</strong>
            {vehicle.registration && ` (${vehicle.registration})`}. This action
            cannot be undone.
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border text-sm font-semibold"
            style={{ borderColor: BORDER, color: NAVY }}
          >
            {hasBookings ? 'Got it' : 'Cancel'}
          </button>
          {!hasBookings && (
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: '#DC2626' }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Vehicle form ──────────────────────────────────────────────────────

function VehicleFormFields({ form, cities }: { form: any; cities: City[] }) {
  const {
    register,
    formState: { errors },
  } = form;
  const sec = (label: string) => (
    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
      {label}
    </p>
  );

  return (
    <div className="space-y-5">
      <div>
        {sec('Vehicle Info')}
        <div className="space-y-3">
          <Field label="Vehicle Name" error={errors.name?.message} required>
            <Input
              {...register('name')}
              placeholder="Toyota Innova Crysta"
              error={errors.name?.message}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" error={errors.category?.message} required>
              <Select
                {...register('category')}
                error={errors.category?.message}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Seats" error={errors.seats?.message} required>
              <Input
                {...register('seats')}
                type="number"
                placeholder="7"
                min={1}
                max={50}
                error={errors.seats?.message}
              />
            </Field>
          </div>
        </div>
      </div>

      <div>
        {sec('Registration & Details')}
        <div className="space-y-3">
          <Field label="Registration No." error={errors.registration?.message}>
            <Input
              {...register('registration')}
              placeholder="MH01AB1234"
              error={errors.registration?.message}
              className="uppercase"
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year" error={errors.year?.message}>
              <Input
                {...register('year')}
                type="number"
                placeholder="2023"
                error={errors.year?.message}
              />
            </Field>
            <Field label="Color" error={errors.color?.message}>
              <Input
                {...register('color')}
                placeholder="Pearl White"
                error={errors.color?.message}
              />
            </Field>
          </div>
        </div>
      </div>

      <div>
        {sec('Base City')}
        <Field label="City" error={errors.baseCityId?.message}>
          <Select
            {...register('baseCityId')}
            error={errors.baseCityId?.message}
          >
            <option value="">Select city…</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}, {c.state}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        {sec('Additional Notes')}
        <Field label="Notes" error={errors.notes?.message}>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Any special features, conditions or notes…"
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all resize-none"
            style={{ borderColor: BORDER, background: '#fff', color: NAVY }}
            onFocus={(e) => (e.target.style.borderColor = BRAND)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          />
        </Field>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────

export function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<VehicleCategory | 'ALL'>('ALL');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'true' | 'false'>(
    'ALL'
  );

  const [addOpen, setAddOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 1. Define types based on the schema
  type VehicleInput = z.input<typeof vehicleSchema>;
  type VehicleOutput = z.output<typeof vehicleSchema>;

  // 2. Use them in your useForm hook
  const addForm = useForm<VehicleInput, any, VehicleOutput>({
    resolver: zodResolver(vehicleSchema),
  });
  const editForm = useForm<VehicleInput, any, VehicleOutput>({
    resolver: zodResolver(vehicleSchema),
  });

  // ── Load cities for select ──────────────────────────────────────────
  useEffect(() => {
    api
      .get<{ data: City[] }>('/api/cars') // reuse public city endpoint
      .catch(() => null);
    // Fetch cities directly from admin endpoint
    api.get<{ data: { cities: City[] } }>('/api/admin/fleet').catch(() => null);
    // Use a dedicated cities endpoint — fallback: extract from vehicles
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      // We'll extract cities from the vehicles list on first load
      const res = await api.get<{ data: Vehicle[] }>(
        '/api/admin/fleet?limit=100'
      );
      const seen = new Map<string, City>();
      res.data.data.forEach((v) => {
        if (v.baseCity) seen.set(v.baseCity.id, v.baseCity);
      });
      setCities(Array.from(seen.values()));
    } catch {
      // Cities will just be empty — non-critical
    }
  };

  // ── Fetch vehicles ──────────────────────────────────────────────────
  const fetchVehicles = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const p = new URLSearchParams({
          page: String(page),
          limit: '20',
          ...(search && { search }),
          ...(catFilter !== 'ALL' && { category: catFilter }),
          ...(activeFilter !== 'ALL' && { active: activeFilter }),
        });
        const res = await api.get<{ data: Vehicle[]; pagination: Pagination }>(
          `/api/admin/fleet?${p}`
        );
        setVehicles(res.data.data);
        setPagination(res.data.pagination);

        // Update cities from fresh data
        const seen = new Map<string, City>();
        res.data.data.forEach((v) => {
          if (v.baseCity) seen.set(v.baseCity.id, v.baseCity);
        });
        if (seen.size > 0)
          setCities((prev) => {
            const map = new Map(prev.map((c) => [c.id, c]));
            seen.forEach((v, k) => map.set(k, v));
            return Array.from(map.values());
          });
      } catch {
        toast.error('Failed to load fleet.');
      } finally {
        setLoading(false);
      }
    },
    [search, catFilter, activeFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchVehicles(1), 350);
    return () => clearTimeout(t);
  }, [fetchVehicles]);

  // ── Create ──────────────────────────────────────────────────────────
  const onCreateSubmit = async (data: VehicleForm) => {
    setSubmitting(true);
    try {
      const clean = {
        ...data,
        registration: data.registration || undefined,
        year: data.year || undefined,
        color: data.color || undefined,
        notes: data.notes || undefined,
        baseCityId: data.baseCityId || undefined,
        seats: Number(data.seats),
      };
      await api.post('/api/admin/fleet', clean);
      toast.success('Vehicle added to fleet.');
      addForm.reset();
      setAddOpen(false);
      fetchVehicles(1);
    } catch (err) {
      toast.error(apiErr(err, 'Failed to add vehicle.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ────────────────────────────────────────────────────────────
  const openEdit = (vehicle: Vehicle) => {
    setMenuOpen(null);
    setEditVehicle(vehicle);
    editForm.reset({
      name: vehicle.name,
      category: vehicle.category,
      seats: vehicle.seats,
      registration: vehicle.registration ?? '',
      year: vehicle.year ?? ('' as unknown as number),
      color: vehicle.color ?? '',
      notes: vehicle.notes ?? '',
      baseCityId: vehicle.baseCity?.id ?? '',
    });
  };

  const onEditSubmit = async (data: VehicleForm) => {
    if (!editVehicle) return;
    setSubmitting(true);
    try {
      const clean = {
        ...data,
        registration: data.registration || undefined,
        year: data.year || undefined,
        color: data.color || undefined,
        notes: data.notes || undefined,
        baseCityId: data.baseCityId || undefined,
        seats: Number(data.seats),
      };
      await api.patch(`/api/admin/fleet/${editVehicle.id}`, clean);
      toast.success('Vehicle updated.');
      setEditVehicle(null);
      fetchVehicles(pagination.page);
    } catch (err) {
      toast.error(apiErr(err, 'Failed to update vehicle.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle ──────────────────────────────────────────────────────────
  const toggleActive = async (vehicle: Vehicle) => {
    setMenuOpen(null);
    setTogglingId(vehicle.id);
    try {
      await api.patch(`/api/admin/fleet/${vehicle.id}/toggle`);
      toast.success(
        `${vehicle.name} ${vehicle.isActive ? 'deactivated' : 'activated'}.`
      );
      fetchVehicles(pagination.page);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/fleet/${deleteTarget.id}`);
      toast.success('Vehicle deleted.');
      setDeleteTarget(null);
      fetchVehicles(pagination.page);
    } catch (err) {
      toast.error(apiErr(err, 'Failed to delete.'));
    } finally {
      setDeleting(false);
    }
  };

  // ── Drawer footer ───────────────────────────────────────────────────
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

  return (
    <div className="space-y-4" onClick={() => menuOpen && setMenuOpen(null)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            Fleet
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {pagination.total} vehicle{pagination.total !== 1 ? 's' : ''} in
            fleet
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
          <Plus size={16} /> Add Vehicle
        </button>
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
            placeholder="Search name or registration…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: BORDER, color: NAVY, background: BG }}
            onFocus={(e) => (e.target.style.borderColor = BRAND)}
            onBlur={(e) => (e.target.style.borderColor = BORDER)}
          />
        </div>

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) =>
            setCatFilter(e.target.value as VehicleCategory | 'ALL')
          }
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: BORDER, color: NAVY, background: BG }}
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>

        {/* Active filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: BG }}
        >
          {(
            [
              ['ALL', 'All'],
              ['true', 'Active'],
              ['false', 'Inactive'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
              style={{
                background: activeFilter === val ? '#fff' : 'transparent',
                color: activeFilter === val ? NAVY : MUTED,
                boxShadow:
                  activeFilter === val ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
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
                  'Vehicle',
                  'Category',
                  'Seats',
                  'Registration',
                  'Year',
                  'Base City',
                  'Bookings',
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
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Car size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm" style={{ color: MUTED }}>
                      {search
                        ? 'No vehicles match your search.'
                        : 'No vehicles yet. Add your first vehicle.'}
                    </p>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors"
                    style={{ borderColor: '#F0F2F5' }}
                  >
                    {/* Name + color */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: CATEGORY_CONFIG[vehicle.category].bg,
                          }}
                        >
                          <Car
                            size={15}
                            style={{
                              color: CATEGORY_CONFIG[vehicle.category].color,
                            }}
                          />
                        </div>
                        <div>
                          <p
                            className="font-semibold text-xs"
                            style={{
                              color: NAVY,
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {vehicle.name}
                          </p>
                          {vehicle.color && (
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: MUTED }}
                            >
                              {vehicle.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <CategoryBadge category={vehicle.category} />
                    </td>

                    <td
                      className="px-4 py-3 text-xs font-medium"
                      style={{ color: NAVY }}
                    >
                      {vehicle.seats}
                    </td>

                    <td className="px-4 py-3">
                      {vehicle.registration ? (
                        <span
                          className="font-mono text-xs font-semibold"
                          style={{ color: NAVY }}
                        >
                          {vehicle.registration}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: MUTED }}>
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>
                      {vehicle.year ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      {vehicle.baseCity ? (
                        <span
                          className="inline-flex items-center gap-1 text-xs"
                          style={{ color: NAVY }}
                        >
                          <MapPin size={11} style={{ color: MUTED }} />
                          {vehicle.baseCity.name}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: MUTED }}>
                          —
                        </span>
                      )}
                    </td>

                    <td
                      className="px-4 py-3 text-xs font-medium"
                      style={{ color: MUTED }}
                    >
                      {vehicle._count.bookings}
                    </td>

                    <td className="px-4 py-3">
                      <ActiveBadge active={vehicle.isActive} />
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === vehicle.id ? null : vehicle.id
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {menuOpen === vehicle.id && (
                        <div
                          className="absolute right-0 top-10 z-30 bg-white rounded-xl border shadow-lg py-1 min-w-[160px]"
                          style={{
                            borderColor: BORDER,
                            boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
                          }}
                        >
                          <button
                            onClick={() => openEdit(vehicle)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left"
                            style={{ color: NAVY }}
                          >
                            <Pencil size={14} style={{ color: MUTED }} /> Edit
                          </button>
                          <button
                            onClick={() => toggleActive(vehicle)}
                            disabled={togglingId === vehicle.id}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                            style={{
                              color: vehicle.isActive ? '#D97706' : '#059669',
                            }}
                          >
                            {togglingId === vehicle.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : vehicle.isActive ? (
                              <ToggleLeft size={14} />
                            ) : (
                              <ToggleRight size={14} />
                            )}
                            {vehicle.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <div
                            className="my-1 border-t"
                            style={{ borderColor: BORDER }}
                          />
                          <button
                            onClick={() => {
                              setMenuOpen(null);
                              setDeleteTarget(vehicle);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-red-50 text-left"
                            style={{ color: '#DC2626' }}
                          >
                            <Trash2 size={14} /> Delete
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
                onClick={() => fetchVehicles(pagination.page - 1)}
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
                    onClick={() => fetchVehicles(p)}
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
                onClick={() => fetchVehicles(pagination.page + 1)}
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

      {/* Add Drawer */}
      <Drawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Vehicle to Fleet"
      >
        <form onSubmit={addForm.handleSubmit(onCreateSubmit)}>
          <VehicleFormFields form={addForm} cities={cities} />
          <DrawerFooter
            onCancel={() => setAddOpen(false)}
            label="Add Vehicle"
            loadingLabel="Adding..."
          />
        </form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        open={!!editVehicle}
        onClose={() => setEditVehicle(null)}
        title={`Edit — ${editVehicle?.name ?? ''}`}
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
          <VehicleFormFields form={editForm} cities={cities} />
          <DrawerFooter
            onCancel={() => setEditVehicle(null)}
            label="Save Changes"
            loadingLabel="Saving..."
          />
        </form>
      </Drawer>

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteModal
          vehicle={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
