// Path: apps/api/src/controllers/fleet.controller.ts

import { Request, Response } from 'express';
import { VehicleCategory } from '@prisma/client';
import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
} from '../schemas/fleet.schema';

// ── GET /api/admin/fleet ──────────────────────────────────────────────

export const listVehicles = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = req.query.search as string | undefined;
  const category = req.query.category as VehicleCategory | undefined;
  const cityId = req.query.cityId as string | undefined;
  const active = req.query.active as string | undefined;
  const skip = (page - 1) * limit;

  const where = {
    ...(category && { category }),
    ...(cityId && { baseCityId: cityId }),
    ...(active !== undefined && { isActive: active === 'true' }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { registration: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [total, vehicles] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        baseCity: { select: { id: true, name: true, state: true } },
        _count: { select: { bookings: true } },
      },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: vehicles,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

// ── GET /api/admin/fleet/:id ──────────────────────────────────────────

export const getVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: req.params.id as string },
    include: {
      baseCity: { select: { id: true, name: true, state: true } },
      _count: { select: { bookings: true } },
    },
  });

  if (!vehicle) throw new AppError('Vehicle not found.', 404);

  res.status(200).json({ success: true, data: vehicle });
});

// ── POST /api/admin/fleet ─────────────────────────────────────────────

export const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as CreateVehicleInput;

  // Check duplicate registration
  if (data.registration) {
    const existing = await prisma.vehicle.findUnique({
      where: { registration: data.registration },
      select: { id: true },
    });
    if (existing)
      throw new AppError(
        'A vehicle with this registration number already exists.',
        409
      );
  }

  // Validate city exists
  if (data.baseCityId) {
    const city = await prisma.city.findUnique({
      where: { id: data.baseCityId },
      select: { id: true },
    });
    if (!city) throw new AppError('City not found.', 404);
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      name: data.name,
      category: data.category,
      seats: data.seats,
      registration: data.registration,
      year: data.year,
      color: data.color,
      notes: data.notes,
      baseCityId: data.baseCityId,
      isActive: true,
    },
    include: {
      baseCity: { select: { id: true, name: true, state: true } },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle added to fleet.',
    data: vehicle,
  });
});

// ── PATCH /api/admin/fleet/:id ────────────────────────────────────────

export const updateVehicle = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as UpdateVehicleInput;

  const existing = await prisma.vehicle.findUnique({
    where: { id: req.params.id as string },
    select: { id: true, registration: true },
  });
  if (!existing) throw new AppError('Vehicle not found.', 404);

  // Check duplicate registration if changed
  if (data.registration && data.registration !== existing.registration) {
    const dup = await prisma.vehicle.findUnique({
      where: { registration: data.registration },
      select: { id: true },
    });
    if (dup)
      throw new AppError(
        'Another vehicle with this registration already exists.',
        409
      );
  }

  if (data.baseCityId) {
    const city = await prisma.city.findUnique({
      where: { id: data.baseCityId },
      select: { id: true },
    });
    if (!city) throw new AppError('City not found.', 404);
  }

  const vehicle = await prisma.vehicle.update({
    where: { id: req.params.id as string },
    data,
    include: {
      baseCity: { select: { id: true, name: true, state: true } },
      _count: { select: { bookings: true } },
    },
  });

  res
    .status(200)
    .json({ success: true, message: 'Vehicle updated.', data: vehicle });
});

// ── PATCH /api/admin/fleet/:id/toggle ────────────────────────────────
// Soft activate / deactivate — never deletes data

export const toggleVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: req.params.id as string },
    select: { id: true, isActive: true },
  });
  if (!vehicle) throw new AppError('Vehicle not found.', 404);

  const updated = await prisma.vehicle.update({
    where: { id: req.params.id as string },
    data: { isActive: !vehicle.isActive },
    select: { id: true, isActive: true, name: true },
  });

  res.status(200).json({
    success: true,
    message: `${updated.name} ${
      updated.isActive ? 'activated' : 'deactivated'
    }.`,
    data: updated,
  });
});

// ── DELETE /api/admin/fleet/:id ───────────────────────────────────────
// Hard delete — only allowed if vehicle has NO bookings

export const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: req.params.id as string },
    include: { _count: { select: { bookings: true } } },
  });

  if (!vehicle) throw new AppError('Vehicle not found.', 404);

  // Guard: refuse to delete if bookings exist — deactivate instead
  if (vehicle._count.bookings > 0) {
    throw new AppError(
      `Cannot delete — this vehicle has ${vehicle._count.bookings} booking(s) on record. Deactivate it instead.`,
      400
    );
  }

  await prisma.vehicle.delete({ where: { id: req.params.id as string } });

  res.status(200).json({ success: true, message: 'Vehicle deleted.' });
});
