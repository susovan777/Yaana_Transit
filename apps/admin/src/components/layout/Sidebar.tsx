// Path: apps/admin/src/components/layout/Sidebar.tsx
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Car,
  CalendarCheck,
  FileText,
  BarChart3,
  Users,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../store/auth.store';
import toast from 'react-hot-toast';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Companies', href: '/companies', icon: Building2, adminOnly: true },
  { label: 'Fleet', href: '/fleet', icon: Car, adminOnly: true },
  { label: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { label: 'Invoices', href: '/invoices', icon: FileText },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Users', href: '/users', icon: Users, adminOnly: true },
];

// ── Sidebar brand colors ──────────────────────────────────────────────
// Using CSS variables so one change here updates the whole sidebar.
const SIDEBAR_BG = '#1C1F26';
const ACCENT = '#3A6AB6';
const ACCENT_PALE = 'rgba(58,106,182,0.18)';
const TEXT_MUTED = 'rgba(255,255,255,0.45)';
const TEXT_HOVER = 'rgba(255,255,255,0.75)';
const BORDER_SUBTLE = 'rgba(255,255,255,0.07)';

type SidebarProps = {
  collapsed: boolean; // tablet: icon-only mode
  mobileOpen: boolean; // mobile: drawer open
  onMobileClose: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'YAANA_ADMIN';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  };

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const sidebarWidth = collapsed ? '64px' : '240px';

  // ── Inner sidebar content (shared between desktop + mobile drawer) ──
  const SidebarContent = ({
    forceExpanded = false,
  }: {
    forceExpanded?: boolean;
  }) => {
    const isExpanded = forceExpanded || !collapsed;

    return (
      <div className="flex flex-col h-full" style={{ background: SIDEBAR_BG }}>
        {/* ── Logo ───────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center h-[64px] shrink-0 border-b px-4"
          style={{ borderColor: BORDER_SUBTLE }}
        >
          {/* Logo image */}
          <div
            className={`flex items-center gap-3 ${
              !isExpanded ? 'justify-center w-full' : ''
            }`}
          >
            <img
              // Update the src to toggle based on isExpanded
              src={isExpanded ? '/logo.png' : '/logo-sm.png'}
              alt="Yana Transit"
              className="h-14 w-auto shrink-0 object-contain"
              onError={(e) => {
                // Fallback to icon if logo is not found
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Mobile close button */}
          {forceExpanded && (
            <button
              onClick={onMobileClose}
              className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={16} className="text-white/60" />
            </button>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5">
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <div key={item.href} className="relative group">
                  <NavLink
                    to={item.href}
                    onClick={forceExpanded ? onMobileClose : undefined}
                    className="flex items-center rounded-lg transition-all duration-150 relative"
                    style={{
                      padding: isExpanded ? '10px 12px' : '10px',
                      justifyContent: isExpanded ? 'flex-start' : 'center',
                      gap: isExpanded ? '10px' : '0',
                      background: isActive ? ACCENT_PALE : 'transparent',
                      color: isActive ? '#fff' : TEXT_MUTED,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background =
                          'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color =
                          TEXT_HOVER;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background =
                          'transparent';
                        (e.currentTarget as HTMLElement).style.color =
                          TEXT_MUTED;
                      }
                    }}
                  >
                    {/* Active bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                        style={{ background: ACCENT }}
                      />
                    )}

                    <item.icon
                      size={17}
                      style={{
                        color: isActive ? ACCENT : 'currentColor',
                        flexShrink: 0,
                      }}
                    />

                    {isExpanded && (
                      <>
                        <span
                          className="text-sm font-medium flex-1"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight
                            size={13}
                            style={{ color: ACCENT, opacity: 0.6 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Tooltip for collapsed mode */}
                  {!isExpanded && (
                    <div
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
                      style={{
                        background: '#1A3460',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {item.label}
                      {/* Tooltip arrow */}
                      <span
                        className="absolute right-full top-1/2 -translate-y-1/2"
                        style={{
                          borderWidth: '5px',
                          borderStyle: 'solid',
                          borderColor:
                            'transparent #1A3460 transparent transparent',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* ── Bottom: User + Logout ───────────────────────────── */}
        <div
          className="shrink-0 border-t px-2 py-3 space-y-1"
          style={{ borderColor: BORDER_SUBTLE }}
        >
          {/* User info row */}
          {isExpanded ? (
            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{
                  background: 'rgba(46,111,216,0.25)',
                  border: '1px solid rgba(46,111,216,0.4)',
                  color: '#6B96D4',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0">
                <p
                  className="text-white text-[13px] font-medium truncate leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {user?.name}
                </p>
                <p
                  className="text-[11px] truncate"
                  style={{ color: TEXT_MUTED }}
                >
                  {user?.role === 'YAANA_ADMIN'
                    ? 'Yana Admin'
                    : user?.role === 'CORPORATE_ADMIN'
                    ? 'Corp. Admin'
                    : 'User'}
                </p>
              </div>
            </div>
          ) : (
            // Collapsed: just the avatar with tooltip
            <div className="relative group flex justify-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-default"
                style={{
                  background: 'rgba(46,111,216,0.25)',
                  border: '1px solid rgba(46,111,216,0.4)',
                  color: '#6B96D4',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style={{
                  background: '#1A3460',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {user?.name}
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-lg transition-all duration-150 text-sm"
            style={{
              padding: isExpanded ? '8px 12px' : '8px',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              gap: isExpanded ? '10px' : '0',
              color: TEXT_MUTED,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLElement).style.color = TEXT_HOVER;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = TEXT_MUTED;
            }}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {isExpanded && (
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>
                Sign out
              </span>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Desktop + Tablet sidebar (fixed) ───────────────── */}
      <aside
        className="fixed top-0 left-0 h-screen z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ───────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onMobileClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[240px] z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent forceExpanded />
      </aside>
    </>
  );
}
