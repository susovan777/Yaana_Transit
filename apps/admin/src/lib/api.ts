// Path: apps/admin/src/lib/api.ts
//
// Axios instance with two interceptors:
//
// REQUEST interceptor:
//   Reads the access token from sessionStorage (set by auth store)
//   and injects it as: Authorization: Bearer <token>
//
// RESPONSE interceptor:
//   On 401 (token expired), silently calls /api/auth/refresh,
//   gets a new access token, updates storage, retries the failed request.
//   If refresh also fails → redirects to /login.
//
// Why sessionStorage over a React ref?
//   Interceptors run outside React's render cycle, so they can't
//   access a React state value directly. sessionStorage is cleared
//   when the tab closes, which is acceptable for an admin panel.

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'yaana_access_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/', // Vite proxy forwards /api/* to localhost:4000
  withCredentials: true, // send httpOnly cookie on every request
  headers: { 'Content-Type': 'application/json' },
});

// ── Token helpers ─────────────────────────────────────────────────────

export function saveToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

// ── Request interceptor ───────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor (silent refresh) ────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only intercept 401s that haven't been retried yet
    // and are NOT the refresh or login endpoints themselves
    const isAuthEndpoint =
      originalRequest.url?.includes('/api/auth/refresh') ||
      originalRequest.url?.includes('/api/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post<{ data: { accessToken: string } }>(
          '/api/auth/refresh'
        );
        const newToken = res.data.data.accessToken;
        saveToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearToken();
        // Redirect to login — use window directly (outside React)
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);