// Path: apps/api/src/controllers/booking.controller.ts

import { Request, Response } from 'express';
import { BookingStatus, ServiceType } from '@prisma/client';
import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';
import type {
  CreateBookingInput,
  UpdateBookingInput,
  UpdateBookingStatusInput,
} from '../schemas/booking.schema';

const BOOKING_SELECT = {
  id: true,
  referenceNo: true,
  status: true,
  serviceType: true,
  startDate: true,
  endDate: true,
  pickupAddress: true,
  dropAddress: true,
  passengerCount: true,
  notes: true,
  adminNotes: true,
  quotedAmount: true,
  finalAmount: true,
  chauffeurName: true,
  chauffeurPhone: true,
  createdAt: true,
  updatedAt: true,
  company: { select: { id: true, name: true, gstNumber: true } },
  user: { select: { id: true, name: true, email: true } },
  pickupCity: { select: { id: true, name: true, state: true } },
  vehicle: {
    select: { id: true, name: true, category: true, registration: true },
  },
  invoice: {
    select: { id: true, invoiceNumber: true, status: true, total: true },
  },
};

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  ENQUIRY: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ONGOING', 'CANCELLED'],
  ONGOING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

async function generateReferenceNo(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count();
  return `YT-${year}-${String(count + 1).padStart(4, '0')}`;
}

// ── GET /api/admin/bookings
export const listBookings = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 15);
  const search = req.query.search as string | undefined;
  const status = req.query.status as BookingStatus | undefined;
  const companyId = req.query.companyId as string | undefined;
  const service = req.query.service as ServiceType | undefined;
  const dateFrom = req.query.dateFrom as string | undefined;
  const dateTo = req.query.dateTo as string | undefined;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(companyId && { companyId }),
    ...(service && { serviceType: service }),
    ...((dateFrom || dateTo) && {
      startDate: {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      },
    }),
    ...(search && {
      OR: [
        { referenceNo: { contains: search, mode: 'insensitive' as const } },
        { chauffeurName: { contains: search, mode: 'insensitive' as const } },
        {
          company: { name: { contains: search, mode: 'insensitive' as const } },
        },
      ],
    }),
  };

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: BOOKING_SELECT,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

// ── GET /api/admin/bookings/:id
export const getBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id as string },
    select: BOOKING_SELECT,
  });
  if (!booking) throw new AppError('Booking not found.', 404);
  res.status(200).json({ success: true, data: booking });
});

// ── POST /api/admin/bookings
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as CreateBookingInput;

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
    select: { id: true, status: true },
  });
  if (!company) throw new AppError('Company not found.', 404);
  if (company.status !== 'ACTIVE')
    throw new AppError('Company is inactive.', 400);

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true, companyId: true },
  });
  if (!user) throw new AppError('User not found.', 404);
  if (user.companyId !== data.companyId)
    throw new AppError('User does not belong to this company.', 400);

  if (data.vehicleId) {
    const v = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      select: { id: true, isActive: true },
    });
    if (!v) throw new AppError('Vehicle not found.', 404);
    if (!v.isActive) throw new AppError('Vehicle is inactive.', 400);
  }

  const referenceNo = await generateReferenceNo();

  const booking = await prisma.booking.create({
    data: {
      referenceNo,
      status: 'ENQUIRY',
      serviceType: data.serviceType,
      companyId: data.companyId,
      userId: data.userId,
      pickupCityId: data.pickupCityId,
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      passengerCount: data.passengerCount,
      notes: data.notes,
      vehicleId: data.vehicleId,
      chauffeurName: data.chauffeurName,
      chauffeurPhone: data.chauffeurPhone,
      quotedAmount: data.quotedAmount,
      adminNotes: data.adminNotes,
    },
    select: BOOKING_SELECT,
  });

  res.status(201).json({
    success: true,
    message: `Booking ${referenceNo} created.`,
    data: booking,
  });
});

// ── PATCH /api/admin/bookings/:id
export const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as UpdateBookingInput;

  const existing = await prisma.booking.findUnique({
    where: { id: req.params.id as string },
    select: { id: true, status: true },
  });
  if (!existing) throw new AppError('Booking not found.', 404);
  if (['COMPLETED', 'CANCELLED'].includes(existing.status))
    throw new AppError(
      `Cannot edit a ${existing.status.toLowerCase()} booking.`,
      400
    );

  if (data.vehicleId) {
    const v = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      select: { id: true, isActive: true },
    });
    if (!v) throw new AppError('Vehicle not found.', 404);
    if (!v.isActive) throw new AppError('Vehicle is inactive.', 400);
  }

  const booking = await prisma.booking.update({
    where: { id: req.params.id as string },
    data,
    select: BOOKING_SELECT,
  });
  res
    .status(200)
    .json({ success: true, message: 'Booking updated.', data: booking });
});

// ── PATCH /api/admin/bookings/:id/status
export const updateBookingStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status, finalAmount, adminNotes } =
      req.body as UpdateBookingStatusInput;

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        status: true,
        vehicleId: true,
        chauffeurName: true,
        referenceNo: true,
      },
    });
    if (!booking) throw new AppError('Booking not found.', 404);

    const allowed = ALLOWED_TRANSITIONS[booking.status];
    if (!allowed.includes(status))
      throw new AppError(
        `Cannot move booking from ${booking.status} to ${status}.`,
        400
      );

    if (status === 'CONFIRMED') {
      if (!booking.vehicleId)
        throw new AppError('Assign a vehicle before confirming.', 400);
      if (!booking.chauffeurName)
        throw new AppError('Assign a chauffeur name before confirming.', 400);
    }
    if (status === 'COMPLETED' && !finalAmount)
      throw new AppError(
        'Final amount is required to complete a booking.',
        400
      );

    const updated = await prisma.booking.update({
      where: { id: req.params.id as string },
      data: {
        status,
        ...(finalAmount && { finalAmount }),
        ...(adminNotes && { adminNotes }),
      },
      select: BOOKING_SELECT,
    });

    res.status(200).json({
      success: true,
      message: `${booking.referenceNo} moved to ${status}.`,
      data: updated,
    });
  }
);
