// Path: apps/api/src/schemas/invoice.schema.ts

import { z } from 'zod';

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'], {
    required_error: 'Status is required',
  }),
});
export type UpdateInvoiceStatusInput = z.infer<
  typeof updateInvoiceStatusSchema
>;

export const recordPaymentSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive'),
  method: z
    .enum(['bank_transfer', 'upi', 'cheque', 'online', 'cash'])
    .optional(),
  referenceNo: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  paidAt: z.coerce.date().optional(),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
