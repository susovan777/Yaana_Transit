// Path: apps/admin/src/store/auth.store.tsx
//
// Simple React Context auth store.
// Access token lives in memory (never localStorage — XSS risk).
// Refresh token lives in httpOnly cookie (managed by the browser).
// On app load, we attempt a silent refresh to restore the session.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api } from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────

export type UserRole = 'YAANA_ADMIN' | 'CORPORATE_ADMIN' | 'CORPORATE_USER';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  companyName: string | null;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean; // true during initial session restore
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokenAndUser: (token: string, user: AuthUser) => void;
};

// ── Context ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // On mount: try to restore session using the refresh token cookie.
  // The cookie is httpOnly so JS can't read it — but the browser
  // sends it automatically with the /api/auth/refresh request.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post<{ data: { accessToken: string } }>(
          '/api/auth/refresh'
        );
        const { accessToken } = res.data.data;

        // Decode user info from the token payload (middle segment, base64)
        // const payload = JSON.parse(atob(accessToken.split('.')[1]));

        // Fetch full user profile using the new access token
        const profileRes = await api.get<{ data: AuthUser }>('/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setState({
          user: profileRes.data.data,
          accessToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        // No valid refresh token — user needs to log in
        setState({
          user: null,
          accessToken: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    restoreSession();
  }, []);

  const setTokenAndUser = useCallback((token: string, user: AuthUser) => {
    setState({
      user,
      accessToken: token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{
        data: { accessToken: string; user: AuthUser };
      }>('/api/auth/login', { email, password });

      const { accessToken, user } = res.data.data;
      setTokenAndUser(accessToken, user);
    },
    [setTokenAndUser]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore errors — clear local state regardless
    }
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
