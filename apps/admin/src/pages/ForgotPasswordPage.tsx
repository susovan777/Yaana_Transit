// Path: apps/admin/src/pages/ForgotPasswordPage.tsx
//
// Allows existing users to request a password reset email.
// Always shows success (doesn't confirm if email exists — prevents enumeration).

import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

const BRAND = '#3A6AB6';
const NAVY = '#0B1F3A';
const BORDER = '#E2E8F2';
const MUTED = '#6B7A90';

const schema = z.object({
  email: z.string().email('Enter a valid email address').toLowerCase().trim(),
});
type ForgotForm = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotForm) => {
    // API always returns 200 — never reveals if email exists
    try {
      await api.post('/api/auth/forgot-password', { email: data.email });
    } catch {
      // Still show success — prevents email enumeration
    }
    setSentEmail(data.email);
    setSent(true);
  };

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

        <div
          className="bg-white rounded-2xl border p-8"
          style={{
            borderColor: BORDER,
            boxShadow: '0 4px 24px rgba(11,31,58,0.08)',
          }}
        >
          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#EBF1FB' }}
                >
                  <Mail size={20} style={{ color: BRAND }} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold"
                    style={{ fontFamily: 'Poppins, sans-serif', color: NAVY }}
                  >
                    Forgot password?
                  </h2>
                  <p className="text-xs" style={{ color: MUTED }}>
                    We'll email you a reset link
                  </p>
                </div>
              </div>

              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: MUTED }}
              >
                Enter the email address linked to your Yaana Transit account.
                We'll send a password reset link valid for 1 hour.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                    style={{ color: NAVY }}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.in"
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{
                      borderColor: errors.email ? '#EF4444' : BORDER,
                      background: '#fff',
                      color: NAVY,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = BRAND)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = errors.email
                        ? '#EF4444'
                        : BORDER)
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{
                    background: BRAND,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-xs font-medium hover:underline"
                  style={{ color: MUTED }}
                >
                  <ArrowLeft size={13} /> Back to Login
                </Link>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-2">
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
                Check your inbox
              </h2>
              <p
                className="text-sm mb-1 leading-relaxed"
                style={{ color: MUTED }}
              >
                If <strong>{sentEmail}</strong> is registered, you'll receive a
                reset link shortly. Check your spam folder if you don't see it.
              </p>
              <p className="text-xs mb-6" style={{ color: MUTED }}>
                The link expires in <strong>1 hour</strong>.
              </p>
              <Link
                to="/login"
                className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: BRAND }}
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
