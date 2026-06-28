// Path: apps/admin/src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // While restoring session from refresh token, show nothing
  // (avoids flash of login page on refresh)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3A6AB6] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#6B7A90] font-[Outfit]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
