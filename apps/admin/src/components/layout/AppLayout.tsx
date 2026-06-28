// Path: apps/admin/src/components/layout/AppLayout.tsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  // Tablet: collapsed (icon-only) vs full sidebar
  const [collapsed, setCollapsed] = useState(false);
  // Mobile: drawer open/closed
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on tablet, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setCollapsed(false); // desktop: always full
        setMobileOpen(false);
      } else if (w >= 768) {
        setCollapsed(true); // tablet: icon-only
        setMobileOpen(false);
      }
      // mobile (<768): sidebar hidden, controlled by drawer
    };

    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar width for the content offset
  const sidebarWidth =
    window.innerWidth < 768 ? '0px' : collapsed ? '64px' : '240px';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Right panel shifts based on sidebar width */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Topbar
          onMenuClick={() => {
            if (window.innerWidth < 768) {
              setMobileOpen(true); // mobile: open drawer
            } else {
              setCollapsed((v) => !v); // tablet/desktop: toggle collapse
            }
          }}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
