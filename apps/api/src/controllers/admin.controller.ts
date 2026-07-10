// Path: apps/api/src/controllers/admin.controller.ts
//
// All routes here are YAANA_ADMIN only.
// Protected by: authenticate + authorize('YAANA_ADMIN')

import { Request, Response } from 'express';
import { CompanyStatus, UserStatus } from '@prisma/client';

import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { sendInvitationEmail } from '../services/email.service';
import { generateSecureToken, hashToken } from '../services/token.service';
import type {
  CreateCompanyInput,
  InviteUserInput,
  UpdateUserStatusInput,
  UpdateCompanyInput,
} from '../schemas/admin.schema';

// ── POST /api/admin/companies ─────────────────────────────────────────

export const createCompany = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as CreateCompanyInput;

  const company = await prisma.company.create({
    data: {
      name: data.name,
      gstNumber: data.gstNumber,
      pan: data.pan,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      creditLimit: data.creditLimit,
      contractStart: data.contractStart,
      contractEnd: data.contractEnd,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Company created successfully.',
    data: company,
  });
});

// ── GET /api/admin/companies ──────────────────────────────────────────

export const listCompanies = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = req.query.search as string | undefined;
  const status = req.query.status as CompanyStatus | undefined;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { gstNumber: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [total, companies] = await Promise.all([
    prisma.company.count({ where }),
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        status: true,
        gstNumber: true,
        contractStart: true,
        contractEnd: true,
        createdAt: true,
        _count: { select: { users: true, bookings: true } },
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: companies,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

// ── GET /api/admin/companies/:id ──────────────────────────────────────

export const getCompany = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params.id as string; // <-- Extract and cast
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      },
      _count: { select: { bookings: true, invoices: true } },
    },
  });

  if (!company) {
    throw new AppError('Company not found.', 404);
  }

  res.status(200).json({ success: true, data: company });
});

// ── PATCH /api/admin/companies/:id ───────────────────────────────────

export const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as UpdateCompanyInput;
  const companyId = req.params.id as string; // <-- Extract and cast

  const exists = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true },
  });

  if (!exists) throw new AppError('Company not found.', 404);

  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      ...data,
      creditLimit: data.creditLimit ?? undefined,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Company updated successfully.',
    data: company,
  });
});

// ── POST /api/admin/users/invite ──────────────────────────────────────
// Creates a user in PENDING state and sends invitation email.

export const inviteUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as InviteUserInput;

  // Check company exists and is active
  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
    select: { id: true, name: true, status: true },
  });

  if (!company) throw new AppError('Company not found.', 404);

  if (company.status !== CompanyStatus.ACTIVE) {
    throw new AppError('Cannot invite users to an inactive company.', 400);
  }

  // Check email is not already registered
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existing) {
    throw new AppError('A user with this email already exists.', 409);
  }

  // Generate invitation token
  const { raw: rawToken, hashed: hashedToken } = generateSecureToken();

  // Create user + invitation token in a transaction
  const user = await prisma.$transaction<any>(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        companyId: data.companyId,
        status: UserStatus.PENDING,
        createdById: req.user!.userId,
      },
    });

    await tx.invitationToken.create({
      data: {
        token: hashedToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      },
    });

    return newUser;
  });

  // Send invitation email (outside transaction — email failure shouldn't roll back DB)
  await sendInvitationEmail({
    toEmail: user.email,
    toName: user.name,
    companyName: company.name,
    invitedByName: req.user!.userId, // We'll improve this to a name later
    activationToken: rawToken,
  });

  res.status(201).json({
    success: true,
    message: `Invitation sent to ${user.email}. They have 48 hours to activate their account.`,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      companyId: user.companyId,
    },
  });
});

// ── GET /api/admin/users ──────────────────────────────────────────────

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = req.query.search as string | undefined;
  const companyId = req.query.companyId as string | undefined;
  const status = req.query.status as UserStatus | undefined;
  const skip = (page - 1) * limit;

  const where = {
    // Exclude YAANA_ADMIN users from this list
    role: { not: 'YAANA_ADMIN' as const },
    ...(companyId && { companyId }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

// ── PATCH /api/admin/users/:id/status ────────────────────────────────

export const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body as UpdateUserStatusInput;
    const userId = req.params.id as string; // <-- Extract and cast

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) throw new AppError('User not found.', 404);

    // Cannot deactivate another YAANA_ADMIN via this endpoint
    if (user.role === 'YAANA_ADMIN') {
      throw new AppError(
        'Cannot modify Yana Admin accounts via this endpoint.',
        403
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status: status as UserStatus },
    });

    // If deactivating, invalidate all their sessions
    if (status === 'INACTIVE') {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }

    res.status(200).json({
      success: true,
      message: `User ${
        status === 'ACTIVE' ? 'activated' : 'deactivated'
      } successfully.`,
      data: { id: updated.id, status: updated.status },
    });
  }
);

// ── POST /api/admin/users/:id/resend-invite ───────────────────────────
// Resend invitation if user hasn't activated yet.

export const resendInvite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string; // <-- Extract and cast
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: { select: { name: true } } },
  });

  if (!user) throw new AppError('User not found.', 404);

  if (user.status !== UserStatus.PENDING) {
    throw new AppError('User has already activated their account.', 400);
  }

  // Invalidate any old unused invitation tokens for this user
  await prisma.invitationToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { expiresAt: new Date() }, // expire immediately
  });

  const { raw: rawToken, hashed: hashedToken } = generateSecureToken();

  await prisma.invitationToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  });

  await sendInvitationEmail({
    toEmail: user.email,
    toName: user.name,
    companyName: user.company?.name ?? 'Your Company',
    invitedByName: 'Yana Transit Team',
    activationToken: rawToken,
  });

  res.status(200).json({
    success: true,
    message: `Invitation resent to ${user.email}.`,
  });
});
