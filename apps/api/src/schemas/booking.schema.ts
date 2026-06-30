// Path: apps/api/src/schemas/booking.schema.ts

import { z } from 'zod';
import { BookingStatus, ServiceType } from '@prisma/client';

const SERVICE_TYPES = [
  'CHAUFFEUR_DRIVEN',
  'AIRPORT_TRANSFER',
  'OUTSTATION',
  'ETS',
  'EVENTS',
  'CORPORATE_LEASE',
] as [ServiceType, ...ServiceType[]];

const BOOKING_STATUSES = [
  'ENQUIRY',
  'CONFIRMED',
  'ONGOING',
  'COMPLETED',
  'CANCELLED',
] as [BookingStatus, ...BookingStatus[]];

export const createBookingSchema = z.object({
  companyId: z
    .string({ required_error: 'Company is required' })
    .cuid('Invalid company ID'),
  userId: z
    .string({ required_error: 'User is required' })
    .cuid('Invalid user ID'),
  serviceType: z.enum(SERVICE_TYPES, {
    required_error: 'Service type is required',
  }),
  pickupCityId: z.string().cuid().optional(),
  pickupAddress: z.string().trim().optional(),
  dropAddress: z.string().trim().optional(),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date().optional(),
  passengerCount: z.number().int().min(1).max(100).optional(),
  notes: z.string().trim().optional(),
  vehicleId: z.string().cuid().optional(),
  chauffeurName: z.string().trim().optional(),
  chauffeurPhone: z.string().trim().optional(),
  quotedAmount: z.number().positive().optional(),
  adminNotes: z.string().trim().optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  serviceType: z.enum(SERVICE_TYPES).optional(),
  pickupCityId: z.string().cuid().nullable().optional(),
  pickupAddress: z.string().trim().nullable().optional(),
  dropAddress: z.string().trim().nullable().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
  passengerCount: z.number().int().min(1).max(100).nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  vehicleId: z.string().cuid().nullable().optional(),
  chauffeurName: z.string().trim().nullable().optional(),
  chauffeurPhone: z.string().trim().nullable().optional(),
  quotedAmount: z.number().positive().nullable().optional(),
  finalAmount: z.number().positive().nullable().optional(),
  adminNotes: z.string().trim().nullable().optional(),
});
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES, { required_error: 'Status is required' }),
  finalAmount: z.number().positive().optional(),
  adminNotes: z.string().trim().optional(),
});
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
