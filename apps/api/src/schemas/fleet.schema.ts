// Path: apps/api/src/schemas/fleet.schema.ts

import { z } from 'zod';
import { VehicleCategory } from '@prisma/client';

const CATEGORIES = [
  'SEDAN',
  'MUV',
  'SUV',
  'PREMIUM_SUV',
  'PREMIUM',
  'LUXURY',
] as [VehicleCategory, ...VehicleCategory[]];

export const createVehicleSchema = z.object({
  name: z
    .string({ required_error: 'Vehicle name is required' })
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  category: z.enum(CATEGORIES, {
    required_error: 'Category is required',
    invalid_type_error: 'Invalid category',
  }),
  seats: z
    .number({
      required_error: 'Seats is required',
      invalid_type_error: 'Seats must be a number',
    })
    .int()
    .min(1, 'Minimum 1 seat')
    .max(50, 'Maximum 50 seats'),
  registration: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      'Invalid registration format (e.g. MH01AB1234)'
    )
    .optional(),
  year: z
    .number()
    .int()
    .min(2000, 'Year must be 2000 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year')
    .optional(),
  color: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  baseCityId: z.string().cuid('Invalid city ID').optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial();
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
