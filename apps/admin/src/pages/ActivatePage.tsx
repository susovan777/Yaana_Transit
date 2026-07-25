// Path: apps/admin/src/pages/ActivatePage.tsx
//
// Handles two flows from the same page:
//   1. Account Activation  — new invited user sets password
//   2. Password Reset      — existing user resets forgotten password
//
// Both flows use the same token-based mechanism — the only
// difference is the endpoint called and the UI copy shown.
//
// URL patterns:
//   /activate?token=xxx          → account activation
//   /reset-password?token=xxx    → password reset

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// ── Constants ─────────────────────────────────────────────────────────

const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';

// ── Schema ────────────────────────────────────────────────────────────

const activateSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ActivateForm = z.infer<typeof activateSchema>;

// ── Password strength indicator ────────────────────────────────────────

type StrengthRule = { label: string; test: (p: string) => boolean };

const RULES: StrengthRule[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = RULES.filter((r) => r.test(password)).length;
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < passed ? colors[passed - 1] : '#E5E7EB' }}
          />
        ))}
      </div>
      <p
        className="text-xs font-medium"
        style={{ color: passed > 0 ? colors[passed - 1] : MUTED }}
      >
        {passed > 0 ? labels[passed - 1] : ''}
      </p>
      {/* Rules checklist */}
      <div className="space-y-1">
        {RULES.map((rule) => (
          <div key={rule.label} className="flex items-center gap-2">
            {rule.test(password) ? (
              <CheckCircle2
                size={12}
                style={{ color: '#10B981', flexShrink: 0 }}
              />
            ) : (
              <XCircle size={12} style={{ color: '#D1D5DB', flexShrink: 0 }} />
            )}
            <span
              className="text-xs"
              style={{ color: rule.test(password) ? '#374151' : MUTED }}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── States ────────────────────────────────────────────────────────────

type PageState = 'loading' | 'form' | 'success' | 'error';

// ── Main component ────────────────────────────────────────────────────

export function ActivatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Detect which flow from the URL path
  const isReset = window.location.pathname.includes('reset-password');

  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivateForm>({ resolver: zodResolver(activateSchema) });

  const watchPassword = watch('password', '');

  // ── Validate token exists on mount
  useEffect(() => {
    if (!token) {
      setErrorMsg(
        isReset
          ? 'No reset token found. Please request a new password reset from the login page.'
          : 'No activation token found. Please check your invitation email or contact your administrator.'
      );
      setPageState('error');
      return;
    }
    // Token exists — show the form
    // We don't pre-validate the token here to avoid unnecessary API calls.
    // The server validates it on submit and returns a clear error if invalid.
    setPageState('form');
  }, [token, isReset]);

  // ── Submit
  const onSubmit = async (data: ActivateForm) => {
    try {
      const endpoint = isReset
        ? '/api/auth/reset-password'
        : '/api/auth/activate';
      await api.post(endpoint, {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setPageState('success');
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message;

      // Known token errors → show error state
      if (
        msg?.includes('expired') ||
        msg?.includes('already been used') ||
        msg?.includes('Invalid')
      ) {
        setErrorMsg(msg ?? 'This link is invalid or has expired.');
        setPageState('error');
      } else {
        // Other errors (validation, network) → show inline toast
        toast.error(msg ?? 'Something went wrong. Please try again.');
      }
    }
  };

  // ── Copy per flow
  const copy = {
    title: isReset ? 'Reset your password' : 'Activate your account',
    subtitle: isReset
      ? 'Enter a new password for your Yaana Transit account.'
      : 'Welcome to Yaana Transit. Set a password to activate your account and get started.',
    buttonLabel: isReset ? 'Reset Password' : 'Activate Account',
    successTitle: isReset ? 'Password reset!' : 'Account activated!',
    successMsg: isReset
      ? 'Your password has been updated. You can now log in with your new password.'
      : 'Your account is ready. Log in with your email and the password you just set.',
    errorTitle: isReset ? 'Reset link invalid' : 'Activation link invalid',
  };

  // ── Render: Loading
  if (pageState === 'loading') {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2
            size={28}
            className="animate-spin"
            style={{ color: BRAND }}
          />
          <p className="text-sm" style={{ color: MUTED }}>
            Checking your link…
          </p>
        </div>
      </PageShell>
    );
  }

  // ── Render: Error
  if (pageState === 'error') {
    return (
      <PageShell>
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#FEE2E2' }}
          >
            <XCircle size={28} style={{ color: '#DC2626' }} />
          </div>
          <h2
            className="text-lg font-bold mb-2"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            {copy.errorTitle}
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: MUTED }}>
            {errorMsg}
          </p>
          <div className="space-y-3">
            {!isReset && (
              <p className="text-xs" style={{ color: MUTED }}>
                Contact your administrator to send a new invitation.
              </p>
            )}
            {isReset && (
              <Link
                to="/forgot-password"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: BRAND }}
              >
                Request a new reset link
              </Link>
            )}
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-lg text-sm font-semibold text-center border"
              style={{ borderColor: BORDER, color: NAVY }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Render: Success
  if (pageState === 'success') {
    return (
      <PageShell>
        <div className="text-center py-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#D1FAE5' }}
          >
            <CheckCircle2 size={28} style={{ color: '#059669' }} />
          </div>
          <h2
            className="text-lg font-bold mb-2"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            {copy.successTitle}
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: MUTED }}>
            {copy.successMsg}
          </p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
          >
            Go to Login
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Render: Form
  return (
    <PageShell>
      {/* Icon */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#EBF1FB' }}
        >
          {isReset ? (
            <KeyRound size={20} style={{ color: BRAND }} />
          ) : (
            <ShieldCheck size={20} style={{ color: BRAND }} />
          )}
        </div>
        <div>
          <h2
            className="text-lg font-bold leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            {copy.title}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>
            Yaana Transit Portal
          </p>
        </div>
      </div>

      <p className="text-sm mb-6 leading-relaxed" style={{ color: MUTED }}>
        {copy.subtitle}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password */}
        <div>
          <label
            className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
            style={{ color: NAVY }}
          >
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-all"
              style={{
                borderColor: errors.password ? '#EF4444' : BORDER,
                background: '#fff',
                color: NAVY,
              }}
              onFocus={(e) => (e.target.style.borderColor = BRAND)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.password
                  ? '#EF4444'
                  : BORDER)
              }
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          {/* Live strength indicator */}
          <PasswordStrength password={watchPassword} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
            style={{ color: NAVY }}
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-all"
              style={{
                borderColor: errors.confirmPassword ? '#EF4444' : BORDER,
                background: '#fff',
                color: NAVY,
              }}
              onFocus={(e) => (e.target.style.borderColor = BRAND)}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.confirmPassword
                  ? '#EF4444'
                  : BORDER)
              }
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
          {/* Match indicator */}
          {watchPassword &&
            watch('confirmPassword') &&
            !errors.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                <span className="text-xs" style={{ color: '#10B981' }}>
                  Passwords match
                </span>
              </div>
            )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ background: BRAND, fontFamily: 'Poppins, sans-serif' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Setting password…
            </>
          ) : (
            copy.buttonLabel
          )}
        </button>

        {/* Back to login */}
        <p className="text-xs text-center" style={{ color: MUTED }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{ color: BRAND }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </PageShell>
  );
}

// ── Shared page shell ─────────────────────────────────────────────────
// Same layout as LoginPage — navy left panel + white right card

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#F7F9FC' }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: NAVY }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span
            className="font-semibold text-lg"
            style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
          >
            Yaana Transit
          </span>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl border p-8"
          style={{
            borderColor: BORDER,
            boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
