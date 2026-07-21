// Path: apps/admin/src/pages/UsersPage.tsx

import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Building2,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

type UserRole = 'CORPORATE_ADMIN' | 'CORPORATE_USER';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  company: { id: string; name: string } | null;
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
  UserStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  ACTIVE: {
    label: 'Active',
    color: '#065F46',
    bg: '#D1FAE5',
    icon: CheckCircle2,
  },
  INACTIVE: {
    label: 'Inactive',
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: AlertCircle,
  },
  PENDING: { label: 'Pending', color: '#92400E', bg: '#FEF3C7', icon: Clock },
};

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  CORPORATE_ADMIN: {
    label: 'Corp. Admin',
    color: '#1D4ED8',
    bg: '#DBEAFE',
    icon: ShieldCheck,
  },
  CORPORATE_USER: {
    label: 'Corp. User',
    color: '#374151',
    bg: '#F3F4F6',
    icon: Shield,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────

function apiErr(e: unknown, fallback: string): string {
  return (
    (e as { response?: { data?: { error?: { message?: string } } } })?.response
      ?.data?.error?.message ?? fallback
  );
}

// ── Zod schema ────────────────────────────────────────────────────────

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Enter a valid email address').toLowerCase().trim(),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .or(z.literal(''))
    .optional(),
  role: z.enum(['CORPORATE_ADMIN', 'CORPORATE_USER'], {
    message: 'Role is required',
  }),
  companyId: z.string().min(1, 'Company is required'),
});

type InviteForm = z.infer<typeof inviteSchema>;

// ── Subcomponents ─────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
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

function RoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLE_CONFIG[role];
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
        className={`fixed top-0 right-0 h-full w-full max-w-[440px] z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ${
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

// ── User detail drawer ────────────────────────────────────────────────

function UserDetailDrawer({
  user,
  onToggleStatus,
  onResendInvite,
  toggling,
  resending,
}: {
  user: UserRecord;
  onClose: () => void;
  onToggleStatus: (user: UserRecord) => void;
  onResendInvite: (user: UserRecord) => void;
  toggling: boolean;
  resending: boolean;
}) {
  return (
    <div className="space-y-5">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
          style={{
            background: '#EBF1FB',
            color: BRAND,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p
            className="font-semibold text-base"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            {user.name}
          </p>
          <p className="text-sm" style={{ color: MUTED }}>
            {user.email}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-0">
        {[
          {
            icon: Building2,
            label: 'Company',
            value: user.company?.name ?? '—',
          },
          { icon: User, label: 'Phone', value: user.phone ?? '—' },
          {
            icon: Clock,
            label: 'Joined',
            value: format(new Date(user.createdAt), 'dd MMM yyyy'),
          },
          {
            icon: CheckCircle2,
            label: 'Last Login',
            value: user.lastLoginAt
              ? format(new Date(user.lastLoginAt), 'dd MMM yyyy, h:mm a')
              : 'Never logged in',
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 py-2.5 border-b"
            style={{ borderColor: '#F0F2F5' }}
          >
            <Icon size={14} className="shrink-0" style={{ color: MUTED }} />
            <div className="flex-1 flex justify-between items-center">
              <span className="text-xs" style={{ color: MUTED }}>
                {label}
              </span>
              <span className="text-xs font-medium" style={{ color: NAVY }}>
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        {/* Resend invite — only for PENDING users */}
        {user.status === 'PENDING' && (
          <button
            onClick={() => onResendInvite(user)}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-all disabled:opacity-50"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            {resending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Mail size={14} />
            )}
            {resending ? 'Resending...' : 'Resend Invitation'}
          </button>
        )}

        {/* Activate / Deactivate — not for PENDING */}
        {user.status !== 'PENDING' && (
          <button
            onClick={() => onToggleStatus(user)}
            disabled={toggling}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: user.status === 'ACTIVE' ? '#FEE2E2' : '#D1FAE5',
              color: user.status === 'ACTIVE' ? '#DC2626' : '#059669',
            }}
          >
            {toggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : user.status === 'ACTIVE' ? (
              <ToggleLeft size={14} />
            ) : (
              <ToggleRight size={14} />
            )}
            {toggling
              ? 'Updating...'
              : user.status === 'ACTIVE'
              ? 'Deactivate Account'
              : 'Activate Account'}
          </button>
        )}

        {/* Info about deactivation */}
        {user.status === 'ACTIVE' && (
          <p className="text-xs text-center" style={{ color: MUTED }}>
            Deactivating will immediately end all active sessions for this user.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [companyFilter, setCompanyFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');

  // UI state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserRecord | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const inviteForm = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  // Load companies for filter + invite form
  useEffect(() => {
    api
      .get<{ data: Company[] }>('/api/admin/companies?limit=100&status=ACTIVE')
      .then((r) => setCompanies(r.data.data))
      .catch(() => {});
  }, []);

  // Fetch users
  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const p = new URLSearchParams({
          page: String(page),
          limit: '15',
          ...(search && { search }),
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
          ...(companyFilter && { companyId: companyFilter }),
          ...(roleFilter && { role: roleFilter }),
        });
        const res = await api.get<{
          data: UserRecord[];
          pagination: Pagination;
        }>(`/api/admin/users?${p}`);
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        toast.error('Failed to load users.');
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, companyFilter, roleFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 350);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  // ── Invite user
  const onInviteSubmit = async (data: InviteForm) => {
    setSubmitting(true);
    try {
      await api.post('/api/admin/users/invite', {
        ...data,
        phone: data.phone || undefined,
      });
      toast.success(`Invitation sent to ${data.email}.`);
      inviteForm.reset();
      setInviteOpen(false);
      fetchUsers(1);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to send invitation.'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle status
  const toggleStatus = async (user: UserRecord) => {
    setMenuOpen(null);
    setDetailUser(null);
    setTogglingId(user.id);
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/api/admin/users/${user.id}/status`, {
        status: newStatus,
      });
      toast.success(
        `${user.name} ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}.`
      );
      fetchUsers(pagination.page);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to update status.'));
    } finally {
      setTogglingId(null);
    }
  };

  // ── Resend invite
  const resendInvite = async (user: UserRecord) => {
    setMenuOpen(null);
    setResendingId(user.id);
    try {
      await api.post(`/api/admin/users/${user.id}/resend-invite`);
      toast.success(`Invitation resent to ${user.email}.`);
    } catch (e) {
      toast.error(apiErr(e, 'Failed to resend invitation.'));
    } finally {
      setResendingId(null);
    }
  };

  // ── Stat counts from current data
  const stats = {
    total: pagination.total,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    pending: users.filter((u) => u.status === 'PENDING').length,
    inactive: users.filter((u) => u.status === 'INACTIVE').length,
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
            Users
          </h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {pagination.total} corporate user{pagination.total !== 1 ? 's' : ''}{' '}
            across all companies
          </p>
        </div>
        <button
          onClick={() => {
            inviteForm.reset();
            setInviteOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
          style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
        >
          <Plus size={16} /> Invite User
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Users',
            value: stats.total,
            color: NAVY,
            bg: '#EBF1FB',
          },
          {
            label: 'Active',
            value: stats.active,
            color: '#065F46',
            bg: '#D1FAE5',
          },
          {
            label: 'Pending',
            value: stats.pending,
            color: '#92400E',
            bg: '#FEF3C7',
          },
          {
            label: 'Inactive',
            value: stats.inactive,
            color: '#6B7280',
            bg: '#F3F4F6',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: BORDER }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: MUTED }}>
              {s.label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: 'Poppins, sans-serif', color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-3 flex items-center gap-3 flex-wrap"
        style={{ borderColor: BORDER }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <input
            type="text"
            placeholder="Search by name or email…"
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

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{
            borderColor: BORDER,
            color: roleFilter ? NAVY : MUTED,
            background: BG,
          }}
        >
          <option value="">All Roles</option>
          <option value="CORPORATE_ADMIN">Corp. Admin</option>
          <option value="CORPORATE_USER">Corp. User</option>
        </select>

        {/* Status tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ background: BG }}
        >
          {(['ALL', 'ACTIVE', 'PENDING', 'INACTIVE'] as const).map((s) => {
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
                  'User',
                  'Company',
                  'Role',
                  'Status',
                  'Last Login',
                  'Joined',
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
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2
                      size={24}
                      className="animate-spin mx-auto"
                      style={{ color: BRAND }}
                    />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <User size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm" style={{ color: MUTED }}>
                      {search
                        ? 'No users match your search.'
                        : 'No users yet. Invite your first corporate user.'}
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    style={{ borderColor: '#F0F2F5' }}
                    onClick={() => {
                      setDetailUser(user);
                      setMenuOpen(null);
                    }}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: '#EBF1FB',
                            color: BRAND,
                            fontFamily: 'Poppins, sans-serif',
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-semibold text-xs truncate max-w-[160px]"
                            style={{
                              color: NAVY,
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-xs truncate max-w-[160px]"
                            style={{ color: MUTED }}
                          >
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-xs" style={{ color: MUTED }}>
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3">
                      {user.company ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-medium truncate max-w-[140px]"
                          style={{ color: NAVY }}
                        >
                          <Building2
                            size={12}
                            style={{ color: MUTED, flexShrink: 0 }}
                          />
                          {user.company.name}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: MUTED }}>
                          —
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>

                    {/* Last Login */}
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {user.lastLoginAt ? (
                        format(new Date(user.lastLoginAt), 'dd MMM yy, h:mm a')
                      ) : (
                        <span className="italic">Never</span>
                      )}
                    </td>

                    {/* Joined */}
                    <td
                      className="px-4 py-3 text-xs whitespace-nowrap"
                      style={{ color: MUTED }}
                    >
                      {format(new Date(user.createdAt), 'dd MMM yyyy')}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === user.id ? null : user.id)
                        }
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {menuOpen === user.id && (
                        <div
                          className="absolute right-0 top-10 z-30 bg-white rounded-xl border shadow-lg py-1 min-w-[180px]"
                          style={{
                            borderColor: BORDER,
                            boxShadow: '0 8px 24px rgba(11,31,58,0.12)',
                          }}
                        >
                          {/* Resend invite — PENDING only */}
                          {user.status === 'PENDING' && (
                            <button
                              onClick={() => resendInvite(user)}
                              disabled={resendingId === user.id}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                              style={{ color: BRAND }}
                            >
                              {resendingId === user.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Mail size={14} />
                              )}
                              Resend Invitation
                            </button>
                          )}

                          {/* Activate / Deactivate — non-PENDING */}
                          {user.status !== 'PENDING' && (
                            <button
                              onClick={() => toggleStatus(user)}
                              disabled={togglingId === user.id}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[#F7F9FC] text-left disabled:opacity-50"
                              style={{
                                color:
                                  user.status === 'ACTIVE'
                                    ? '#DC2626'
                                    : '#059669',
                              }}
                            >
                              {togglingId === user.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : user.status === 'ACTIVE' ? (
                                <ToggleLeft size={14} />
                              ) : (
                                <ToggleRight size={14} />
                              )}
                              {user.status === 'ACTIVE'
                                ? 'Deactivate'
                                : 'Activate'}
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
                onClick={() => fetchUsers(pagination.page - 1)}
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
                    onClick={() => fetchUsers(p)}
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
                onClick={() => fetchUsers(pagination.page + 1)}
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

      {/* ── Invite Drawer */}
      <Drawer
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite New User"
      >
        <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)}>
          <div className="space-y-5">
            <div
              className="p-3 rounded-lg text-xs leading-relaxed"
              style={{ background: '#EBF1FB', color: BRAND }}
            >
              An invitation email will be sent to the user with a link to set
              their password. The link expires in <strong>48 hours</strong>.
            </div>

            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                User Details
              </p>
              <div className="space-y-3">
                <Field
                  label="Full Name"
                  error={inviteForm.formState.errors.name?.message}
                  required
                >
                  <Input
                    {...inviteForm.register('name')}
                    placeholder="Rajesh Kumar"
                    error={inviteForm.formState.errors.name?.message}
                  />
                </Field>
                <Field
                  label="Email Address"
                  error={inviteForm.formState.errors.email?.message}
                  required
                >
                  <Input
                    {...inviteForm.register('email')}
                    type="email"
                    placeholder="rajesh@company.in"
                    error={inviteForm.formState.errors.email?.message}
                  />
                </Field>
                <Field
                  label="Phone (optional)"
                  error={inviteForm.formState.errors.phone?.message}
                >
                  <Input
                    {...inviteForm.register('phone')}
                    type="tel"
                    placeholder="+91 98765 43210"
                    error={inviteForm.formState.errors.phone?.message}
                  />
                </Field>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Access
              </p>
              <div className="space-y-3">
                <Field
                  label="Company"
                  error={inviteForm.formState.errors.companyId?.message}
                  required
                >
                  <select
                    {...inviteForm.register('companyId')}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                    style={{
                      borderColor: inviteForm.formState.errors.companyId
                        ? '#EF4444'
                        : BORDER,
                      color: NAVY,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = BRAND)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = inviteForm.formState.errors
                        .companyId
                        ? '#EF4444'
                        : BORDER)
                    }
                  >
                    <option value="">Select company…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {inviteForm.formState.errors.companyId && (
                    <p className="text-red-500 text-xs mt-1">
                      {inviteForm.formState.errors.companyId.message}
                    </p>
                  )}
                </Field>

                <Field
                  label="Role"
                  error={inviteForm.formState.errors.role?.message}
                  required
                >
                  <div className="grid grid-cols-2 gap-2">
                    {(['CORPORATE_ADMIN', 'CORPORATE_USER'] as const).map(
                      (role) => {
                        const cfg = ROLE_CONFIG[role];
                        const Icon = cfg.icon;
                        const selected = inviteForm.watch('role') === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              inviteForm.setValue('role', role, {
                                shouldValidate: true,
                              })
                            }
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all"
                            style={{
                              borderColor: selected ? BRAND : BORDER,
                              background: selected ? '#EBF1FB' : '#fff',
                              color: selected ? BRAND : MUTED,
                              boxShadow: selected
                                ? `0 0 0 2px ${BRAND}30`
                                : 'none',
                            }}
                          >
                            <Icon
                              size={18}
                              style={{ color: selected ? BRAND : MUTED }}
                            />
                            {cfg.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                  {inviteForm.formState.errors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {inviteForm.formState.errors.role.message}
                    </p>
                  )}
                </Field>

                {/* Role explanation */}
                <div className="space-y-2">
                  <div
                    className="flex gap-2 p-2.5 rounded-lg text-xs"
                    style={{ background: BG }}
                  >
                    <ShieldCheck
                      size={13}
                      className="shrink-0 mt-0.5"
                      style={{ color: '#1D4ED8' }}
                    />
                    <div>
                      <p className="font-semibold" style={{ color: NAVY }}>
                        Corp. Admin
                      </p>
                      <p style={{ color: MUTED }}>
                        Can view all company bookings and invoices. Can manage
                        company users.
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex gap-2 p-2.5 rounded-lg text-xs"
                    style={{ background: BG }}
                  >
                    <Shield
                      size={13}
                      className="shrink-0 mt-0.5"
                      style={{ color: MUTED }}
                    />
                    <div>
                      <p className="font-semibold" style={{ color: NAVY }}>
                        Corp. User
                      </p>
                      <p style={{ color: MUTED }}>
                        Can create and view their own bookings only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex gap-3 mt-6 pt-4 border-t sticky bottom-0 bg-white pb-2"
            style={{ borderColor: BORDER }}
          >
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
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
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={14} />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </Drawer>

      {/* ── User Detail Drawer */}
      <Drawer
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        title="User Details"
      >
        {detailUser && (
          <UserDetailDrawer
            user={detailUser}
            onClose={() => setDetailUser(null)}
            onToggleStatus={(u) => toggleStatus(u)}
            onResendInvite={(u) => resendInvite(u)}
            toggling={togglingId === detailUser.id}
            resending={resendingId === detailUser.id}
          />
        )}
      </Drawer>
    </div>
  );
}
