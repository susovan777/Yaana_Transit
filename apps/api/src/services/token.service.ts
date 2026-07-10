// Path: apps/api/src/services/token.service.ts
//
// Handles all JWT and refresh token operations.
//
// ACCESS TOKEN  — Short-lived JWT (15 min). Sent in response body.
//                 Client stores in memory (NOT localStorage).
//                 Carries: userId, role, companyId
//
// REFRESH TOKEN — Long-lived (7 days). Random 64-byte hex string.
//                 Stored as httpOnly cookie (JS cannot read it).
//                 A SHA-256 hash of it is stored in the DB.
//                 On every use, old token is deleted and new one issued
//                 (rotation). This means stolen tokens auto-expire.

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '@prisma/client';

// ── Types ────────────────────────────────────────────────────────────

export type AccessTokenPayload = {
  userId: string;
  role: Role;
  companyId: string | null; // null for YAANA_ADMIN
};

export type RefreshTokenPair = {
  raw: string; // sent in httpOnly cookie
  hashed: string; // stored in DB
};

// ── Env validation ───────────────────────────────────────────────────
// Fail loudly at startup if secrets are missing — better than
// silently using weak/undefined secrets in production.

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
}

// ── Access token ─────────────────────────────────────────────────────

export function signAccessToken(payload: AccessTokenPayload): string {
  const secret = requireEnv('JWT_SECRET');
  return jwt.sign(payload, secret, {
    expiresIn: '15m',
    issuer: 'yaana-transit-api',
    audience: 'yaana-transit-client',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = requireEnv('JWT_SECRET');
  return jwt.verify(token, secret, {
    issuer: 'yaana-transit-api',
    audience: 'yaana-transit-client',
  }) as AccessTokenPayload;
}

// ── Refresh token ────────────────────────────────────────────────────

// Generate a cryptographically secure random token.
// Returns both the raw value (for the cookie) and
// its SHA-256 hash (for the database).
export function generateRefreshToken(): RefreshTokenPair {
  const raw = crypto.randomBytes(64).toString('hex'); // 128-char hex string
  const hashed = hashToken(raw);
  return { raw, hashed };
}

// Hash a raw token for DB storage.
// SHA-256 is fine here — we're not hashing passwords,
// just preventing DB leaks from exposing live tokens.
export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// ── Invitation / password reset token ────────────────────────────────

// Generates a secure one-time token for email invitations
// and password resets. Same pattern — raw goes in email link,
// hash goes in DB.
export function generateSecureToken(): RefreshTokenPair {
  const raw = crypto.randomBytes(32).toString('hex'); // 64-char hex
  const hashed = hashToken(raw);
  return { raw, hashed };
}

// ── Cookie helpers ────────────────────────────────────────────────────

export const REFRESH_TOKEN_COOKIE = 'yaana_refresh';

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
  domain:
    process.env.NODE_ENV === 'production'
      ? process.env.COOKIE_DOMAIN // e.g. '.yaanatransit.com'
      : undefined,
};

export function clearRefreshCookieOptions() {
  return {
    ...refreshCookieOptions,
    maxAge: 0,
  };
}
