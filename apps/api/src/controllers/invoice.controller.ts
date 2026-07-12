// Path: apps/api/src/controllers/invoice.controller.ts

import { Request, Response } from 'express';
import { InvoiceStatus } from '@prisma/client';
import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { generateInvoicePdf, InvoicePdfData } from '../services/pdf.service';
import { sendInvoiceEmail } from '../services/email.service';
import type {
  UpdateInvoiceStatusInput,
  RecordPaymentInput,
} from '../schemas/invoice.schema';

const INVOICE_SELECT = {
  id: true,
  invoiceNumber: true,
  status: true,
  subtotal: true,
  cgst: true,
  sgst: true,
  igst: true,
  total: true,
  sacCode: true,
  gstType: true,
  companyGst: true,
  yaanaGst: true,
  issueDate: true,
  dueDate: true,
  paidAt: true,
  notes: true,
  createdAt: true,
  company: {
    select: {
      id: true,
      name: true,
      gstNumber: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      email: true,
    },
  },
  booking: {
    select: {
      id: true,
      referenceNo: true,
      serviceType: true,
      startDate: true,
      endDate: true,
      vehicle: { select: { name: true } },
      chauffeurName: true,
    },
  },
  payments: {
    select: {
      id: true,
      amount: true,
      status: true,
      method: true,
      referenceNo: true,
      paidAt: true,
      createdAt: true,
    },
  },
};

// ── GET /api/admin/invoices ───────────────────────────────────────────

export const listInvoices = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 15);
  const search = req.query.search as string | undefined;
  const status = req.query.status as InvoiceStatus | undefined;
  const companyId = req.query.companyId as string | undefined;
  const dateFrom = req.query.dateFrom as string | undefined;
  const dateTo = req.query.dateTo as string | undefined;
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(companyId && { companyId }),
    ...((dateFrom || dateTo) && {
      issueDate: {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      },
    }),
    ...(search && {
      OR: [
        { invoiceNumber: { contains: search, mode: 'insensitive' as const } },
        {
          company: { name: { contains: search, mode: 'insensitive' as const } },
        },
      ],
    }),
  };

  const [total, invoices, summary] = await Promise.all([
    prisma.invoice.count({ where }),
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { issueDate: 'desc' },
      select: INVOICE_SELECT,
    }),
    prisma.invoice.aggregate({ where, _sum: { total: true } }),
  ]);

  res.status(200).json({
    success: true,
    data: invoices,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    summary: { totalAmount: Number(summary._sum.total ?? 0) },
  });
});

// ── GET /api/admin/invoices/:id ───────────────────────────────────────

export const getInvoice = catchAsync(async (req: Request, res: Response) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id as string },
    select: INVOICE_SELECT,
  });
  if (!invoice) throw new AppError('Invoice not found.', 404);
  res.status(200).json({ success: true, data: invoice });
});

// ── PATCH /api/admin/invoices/:id/status ──────────────────────────────
// Manually mark invoice status (e.g. DRAFT -> SENT, or -> CANCELLED)

export const updateInvoiceStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body as UpdateInvoiceStatusInput;

    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id as string },
      select: { id: true, status: true },
    });
    if (!invoice) throw new AppError('Invoice not found.', 404);

    if (invoice.status === 'PAID' && status !== 'CANCELLED') {
      throw new AppError(
        'A paid invoice can only be cancelled, not reverted.',
        400
      );
    }

    const updated = await prisma.invoice.update({
      where: { id: req.params.id as string },
      data: { status, ...(status === 'PAID' && { paidAt: new Date() }) },
      select: INVOICE_SELECT,
    });

    res.status(200).json({
      success: true,
      message: `Invoice marked as ${status}.`,
      data: updated,
    });
  }
);

// ── POST /api/admin/invoices/:id/payments ─────────────────────────────
// Record a payment against an invoice. Auto-marks PAID if fully covered.

export const recordPayment = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as RecordPaymentInput;

  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id as string },
    select: {
      id: true,
      total: true,
      status: true,
      payments: { select: { amount: true, status: true } },
    },
  });
  if (!invoice) throw new AppError('Invoice not found.', 404);
  if (invoice.status === 'CANCELLED')
    throw new AppError('Cannot record payment on a cancelled invoice.', 400);

  const alreadyPaid = invoice.payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const newTotal = alreadyPaid + data.amount;

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        invoiceId: req.params.id as string,
        amount: data.amount,
        status: 'PAID',
        method: data.method,
        referenceNo: data.referenceNo,
        notes: data.notes,
        paidAt: data.paidAt ?? new Date(),
      },
    }),
    ...(newTotal >= Number(invoice.total)
      ? [
          prisma.invoice.update({
            where: { id: req.params.id as string },
            data: { status: 'PAID' as const, paidAt: new Date() },
          }),
        ]
      : []),
  ]);

  const updated = await prisma.invoice.findUnique({
    where: { id: req.params.id as string },
    select: INVOICE_SELECT,
  });

  res.status(201).json({
    success: true,
    message:
      newTotal >= Number(invoice.total)
        ? 'Payment recorded — invoice fully paid.'
        : 'Payment recorded.',
    data: updated,
  });
});

// ── Helper: build PDF data object from a fetched invoice ──────────────

function buildPdfData(
  invoice: NonNullable<Awaited<ReturnType<typeof getInvoiceForPdf>>>
): InvoicePdfData {
  return {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    yaanaGst: invoice.yaanaGst,
    companyName: invoice.company.name,
    companyGst: invoice.company.gstNumber,
    companyAddress: invoice.company.address,
    companyCity: invoice.company.city,
    companyState: invoice.company.state,
    companyPincode: invoice.company.pincode,
    bookingRefNo: invoice.booking.referenceNo,
    serviceType: invoice.booking.serviceType,
    startDate: invoice.booking.startDate,
    endDate: invoice.booking.endDate,
    vehicleName: invoice.booking.vehicle?.name ?? null,
    chauffeurName: invoice.booking.chauffeurName,
    subtotal: Number(invoice.subtotal),
    cgst: Number(invoice.cgst),
    sgst: Number(invoice.sgst),
    igst: Number(invoice.igst),
    total: Number(invoice.total),
    sacCode: invoice.sacCode,
    gstType: invoice.gstType,
    notes: invoice.notes,
  };
}

async function getInvoiceForPdf(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    select: {
      invoiceNumber: true,
      status: true,
      issueDate: true,
      dueDate: true,
      subtotal: true,
      cgst: true,
      sgst: true,
      igst: true,
      total: true,
      sacCode: true,
      gstType: true,
      yaanaGst: true,
      notes: true,
      company: {
        select: {
          name: true,
          gstNumber: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          email: true,
        },
      },
      booking: {
        select: {
          referenceNo: true,
          serviceType: true,
          startDate: true,
          endDate: true,
          chauffeurName: true,
          vehicle: { select: { name: true } },
        },
      },
    },
  });
}

// ── GET /api/admin/invoices/:id/pdf ───────────────────────────────────
// Streams the PDF directly to the browser for download.

export const downloadInvoicePdf = catchAsync(
  async (req: Request, res: Response) => {
    const invoice = await getInvoiceForPdf(req.params.id as string);
    if (!invoice) throw new AppError('Invoice not found.', 404);

    const pdfBuffer = await generateInvoicePdf(buildPdfData(invoice));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  }
);

// ── POST /api/admin/invoices/:id/send ─────────────────────────────────
// Generates the PDF and emails it to the company's billing email.
// Auto-marks invoice as SENT if currently DRAFT.

export const sendInvoiceToCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const invoice = await getInvoiceForPdf(req.params.id as string);
    if (!invoice) throw new AppError('Invoice not found.', 404);
    if (!invoice.company.email)
      throw new AppError('Company has no email address on file.', 400);

    const pdfBuffer = await generateInvoicePdf(buildPdfData(invoice));

    await sendInvoiceEmail({
      toEmail: invoice.company.email,
      companyName: invoice.company.name,
      invoiceNumber: invoice.invoiceNumber,
      total: Number(invoice.total),
      dueDate: invoice.dueDate,
      pdfBuffer,
    });

    if (invoice.status === 'DRAFT') {
      await prisma.invoice.update({
        where: { id: req.params.id as string },
        data: { status: 'SENT' },
      });
    }

    res.status(200).json({
      success: true,
      message: `Invoice emailed to ${invoice.company.email}.`,
    });
  }
);
