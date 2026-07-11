// Path: apps/api/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserStatus } from '@prisma/client';

import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';
import {
  signAccessToken,
  generateRefreshToken,
  generateSecureToken,
  hashToken,
  REFRESH_TOKEN_COOKIE,
  refreshCookieOptions,
  clearRefreshCookieOptions,
} from '../services/token.service';
import { sendPasswordResetEmail } from '../services/email.service';
import type {
  LoginInput,
  ActivateAccountInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../schemas/auth.schema';

// ── POST /api/auth/login ──────────────────────────────────────────────

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  // 1. Find user — intentionally vague error to prevent user enumeration
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      status: true,
      companyId: true,
      company: { select: { name: true, status: true } },
    },
  });

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password.', 401);
  }

  // 2. Account status checks
  if (user.status === UserStatus.PENDING) {
    throw new AppError(
      'Account not activated. Please check your email for the invitation link.',
      403
    );
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new AppError(
      'Your account has been deactivated. Please contact your administrator.',
      403
    );
  }

  // 3. Company status check (for corporate users)
  if (user.company && user.company.status === 'INACTIVE') {
    throw new AppError(
      'Your company account is inactive. Please contact Yaana Transit support.',
      403
    );
  }

  // 4. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  // 5. Generate tokens
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
    companyId: user.companyId,
  });

  const { raw: rawRefreshToken, hashed: hashedRefreshToken } =
    generateRefreshToken();

  // 6. Store hashed refresh token in DB
  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userAgent: req.headers['user-agent'] ?? null,
      ipAddress: req.ip ?? null,
    },
  });

  // 7. Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 8. Set refresh token in httpOnly cookie
  res.cookie(REFRESH_TOKEN_COOKIE, rawRefreshToken, refreshCookieOptions);

  // 9. Return access token and user info in response body
  res.status(200).json({
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name ?? null,
      },
    },
  });
});

// ── POST /api/auth/refresh ────────────────────────────────────────────
// Called by frontend when access token expires.
// Reads refresh token from httpOnly cookie.

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

  if (!rawToken) {
    throw new AppError('No refresh token found. Please log in.', 401);
  }

  const hashedToken = hashToken(rawToken);

  // Find the refresh token in DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          status: true,
          companyId: true,
          company: { select: { status: true } },
        },
      },
    },
  });

  if (!storedToken) {
    // Token not found — could be a replay attack. Clear cookie.
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearRefreshCookieOptions());
    throw new AppError('Invalid session. Please log in again.', 401);
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearRefreshCookieOptions());
    throw new AppError('Session expired. Please log in again.', 401);
  }

  // Check user is still active
  if (storedToken.user.status !== UserStatus.ACTIVE) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    res.clearCookie(REFRESH_TOKEN_COOKIE, clearRefreshCookieOptions());
    throw new AppError('Account is no longer active.', 403);
  }

  // Rotate: delete old token, issue new pair
  const { raw: newRawToken, hashed: newHashedToken } = generateRefreshToken();

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      token: newHashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const newAccessToken = signAccessToken({
    userId: storedToken.user.id,
    role: storedToken.user.role,
    companyId: storedToken.user.companyId,
  });

  res.cookie(REFRESH_TOKEN_COOKIE, newRawToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    data: { accessToken: newAccessToken },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────

export const logout = catchAsync(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

  if (rawToken) {
    const hashedToken = hashToken(rawToken);
    // Delete from DB — silently ignore if already gone
    await prisma.refreshToken
      .delete({ where: { token: hashedToken } })
      .catch(() => null);
  }

  res.clearCookie(REFRESH_TOKEN_COOKIE, clearRefreshCookieOptions());

  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// ── POST /api/auth/activate ───────────────────────────────────────────
// User clicks invitation email link → sets password → account activated.

export const activateAccount = catchAsync(
  async (req: Request, res: Response) => {
    const { token, password } = req.body as ActivateAccountInput;

    const hashedToken = hashToken(token);

    const invitation = await prisma.invitationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!invitation) {
      throw new AppError(
        'Invalid or expired activation link. Please contact your administrator.',
        400
      );
    }

    if (invitation.usedAt) {
      throw new AppError(
        'This activation link has already been used. Please log in or request a new invitation.',
        400
      );
    }

    if (invitation.expiresAt < new Date()) {
      throw new AppError(
        'This activation link has expired (48 hours). Please contact your administrator for a new invitation.',
        400
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Activate user and consume token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: invitation.userId },
        data: {
          passwordHash,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.invitationToken.update({
        where: { id: invitation.id },
        data: { usedAt: new Date() },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Account activated successfully. You can now log in.',
    });
  }
);

// ── POST /api/auth/forgot-password ───────────────────────────────────
// Always returns 200 to prevent email enumeration.

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body as ForgotPasswordInput;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, status: true },
    });

    // Always respond 200 — never confirm if email exists
    const successResponse = {
      success: true,
      message:
        'If that email is registered, you will receive a password reset link shortly.',
    };

    if (!user || user.status !== UserStatus.ACTIVE) {
      // Send the response, then return void to exit early
      res.status(200).json(successResponse);
      return;
    }

    const { raw, hashed } = generateSecureToken();

    // Store reset token (reuse InvitationToken model — same pattern)
    await prisma.invitationToken.create({
      data: {
        token: hashed,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail({
      toEmail: email,
      toName: user.name,
      resetToken: raw,
    });

    res.status(200).json(successResponse);
  }
);

// ── POST /api/auth/reset-password ────────────────────────────────────

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body as ResetPasswordInput;

  const hashedToken = hashToken(token);

  const resetEntry = await prisma.invitationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetEntry || resetEntry.usedAt || resetEntry.expiresAt < new Date()) {
    throw new AppError('Invalid or expired password reset link.', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetEntry.userId },
      data: { passwordHash },
    }),
    prisma.invitationToken.update({
      where: { id: resetEntry.id },
      data: { usedAt: new Date() },
    }),
    // Invalidate all existing sessions on password change
    prisma.refreshToken.deleteMany({
      where: { userId: resetEntry.userId },
    }),
  ]);

  res.status(200).json({
    success: true,
    message:
      'Password reset successfully. Please log in with your new password.',
  });
});
