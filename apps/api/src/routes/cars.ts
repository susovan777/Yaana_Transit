// Path: apps/api/src/routes/cars.ts
//
// Vehicle catalog — public endpoints (no auth required).
// These power the marketing website's fleet section.
//
// Note: B2B model — no pricing returned here.
// Enquiries go via WhatsApp/contact form.
//
// Endpoints:
//   GET /api/cars          — list active vehicles (with optional filters)
//   GET /api/cars/:id      — single vehicle detail

import { z } from 'zod';
import { Router, Request, Response } from 'express';
import { VehicleCategory } from '@prisma/client';

import prisma from '../lib/prisma';
import { AppError, catchAsync } from '../middleware/errorHandler';

const router: Router = Router();

// ── Query params schema ───────────────────────────────────────────────
const vehiclesQuerySchema = z.object({
  category: z
    .enum(['SEDAN', 'MUV', 'SUV', 'PREMIUM_SUV', 'PREMIUM', 'LUXURY'] as [
      VehicleCategory,
      ...VehicleCategory[]
    ])
    .optional(),
  cityId: z.string().cuid().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
});

// ── GET /api/cars ─────────────────────────────────────────────────────
router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const query = vehiclesQuerySchema.parse(req.query);

    // Ensure numbers are safely calculated
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query.category) {
      where.category = query.category;
    }
    if (query.cityId) {
      where.baseCityId = query.cityId;
    }

    const [total, vehicles] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { category: 'asc' },
        select: {
          id: true,
          name: true,
          category: true,
          seats: true,
          baseCity: { select: { id: true, name: true, state: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  })
);

// ── GET /api/cars/:id ─────────────────────────────────────────────────
router.get(
  '/:id',
  catchAsync(async (req: Request, res: Response) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        name: true,
        category: true,
        seats: true,
        year: true,
        color: true,
        isActive: true,
        notes: true,
        baseCity: { select: { id: true, name: true, state: true } },
      },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found.', 404);
    }

    res.json({ success: true, data: vehicle });
  })
);

export default router;
