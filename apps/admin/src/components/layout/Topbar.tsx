// Path: apps/admin/src/components/layout/Topbar.tsx
import { useLocation } from 'react-router-dom';
import {
  Bell,
  Building2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../store/auth.store';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/companies': 'Companies',
  '/fleet': 'Fleet',
  '/bookings': 'Bookings',
  '/invoices': 'Invoices',
  '/reports': 'Reports',
  '/users': 'Users',
};

type TopbarProps = {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
};

export function Topbar({ onMenuClick, sidebarCollapsed }: TopbarProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const title = PAGE_TITLES[pathname] ?? 'Yana Transit';
  const isCorporateUser = user?.role !== 'YAANA_ADMIN';
  const isMobile = window.innerWidth < 768;

  return (
    <header
      className="h-[64px] flex items-center justify-between px-4 md:px-6 shrink-0 bg-white border-b"
      style={{ borderColor: '#E2E8F2' }}
    >
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3">
        {/* Hamburger / collapse toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-[#6B7A90] hover:bg-[#F0F5FF] hover:text-[#3A6AB6] transition-colors"
          aria-label="Toggle sidebar"
        >
          {isMobile ? (
            <Menu size={20} />
          ) : sidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        {/* <h1
          className="text-[16px] md:text-[17px] font-semibold text-[#1C1F26]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Yaana Transit
        </h1> */}
        <div>
          <p
            className="text-[#1C1F26] font-semibold text-[15px] leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Yana Transit
          </p>
          <p className="text-gray-500 text-[10px] tracking-[1.5px] uppercase font-medium">
            Admin Panel
          </p>
        </div>

        {/* Company scope pill */}
        {isCorporateUser && user?.companyName && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F0FE] border border-[#3A6AB6]/20 text-[11px] font-semibold text-[#3A6AB6] tracking-wide">
            <Building2 size={11} />
            {user.companyName}
          </span>
        )}
      </div>

      {/* Right: badge + bell */}
      <div className="flex items-center gap-2">
        {user?.role === 'YAANA_ADMIN' && (
          <span className="hidden sm:block px-2.5 py-1 rounded-full bg-[#1C1F26] text-[10px] font-bold text-white tracking-[1px] uppercase">
            Yana Admin
          </span>
        )}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#6B7A90] hover:bg-[#F0F5FF] hover:text-[#3A6AB6] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}
