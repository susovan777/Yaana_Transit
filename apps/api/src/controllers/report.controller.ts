// Path: apps/api/src/controllers/report.controller.ts
//
// Generates downloadable Excel reports for:
//   1. GST Report       — invoice-level GST breakdown for CA/accountant
//   2. Booking Summary  — operational overview by company/service/status
//   3. Revenue Report   — month-wise revenue per company
//
// All reports use SheetJS (xlsx) — generated in memory, streamed as
// .xlsx file download. No files written to disk.

import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { startOfMonth, subMonths, format } from 'date-fns';
import prisma from '../lib/prisma';
import { catchAsync, AppError } from '../middleware/errorHandler';

// ── Helpers ───────────────────────────────────────────────────────────

function parseDate(val: unknown, fallback: Date): Date {
  if (typeof val === 'string' && val) {
    const d = new Date(val);
    return isNaN(d.getTime()) ? fallback : d;
  }
  return fallback;
}

function inr(n: number | string | null | undefined): number {
  return Number(n ?? 0);
}

// Streams the workbook as an xlsx download
function sendXlsx(res: Response, wb: XLSX.WorkBook, filename: string) {
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', buffer.length);
  res.send(buffer);
}

// Applies bold header style to first row
function styleHeader(ws: XLSX.WorkSheet, cols: number) {
  for (let c = 0; c < cols; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[addr]) continue;
    ws[addr].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '0B1F3A' } },
      alignment: { horizontal: 'center' },
    };
  }
}

// Sets column widths based on content array
function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
}

const SERVICE_LABELS: Record<string, string> = {
  CHAUFFEUR_DRIVEN: 'Chauffeur Driven',
  AIRPORT_TRANSFER: 'Airport Transfer',
  OUTSTATION: 'Outstation',
  ETS: 'Employee Transportation Services',
  EVENTS: 'Events & Occasions',
  CORPORATE_LEASE: 'Corporate Lease',
};

// ── 1. GST Report ─────────────────────────────────────────────────────
export const gstReport = catchAsync(async (req: Request, res: Response) => {
  const now = new Date();
  const dateFrom = parseDate(req.query.from, startOfMonth(now));
  const dateTo = parseDate(req.query.to, now);
  const companyId = req.query.companyId as string | undefined;

  if (dateFrom > dateTo)
    throw new AppError('Start date must be before end date.', 400);

  const invoices = await prisma.invoice.findMany({
    where: {
      issueDate: { gte: dateFrom, lte: dateTo },
      status: { not: 'CANCELLED' },
      ...(companyId && { companyId }),
    },
    orderBy: { issueDate: 'asc' },
    select: {
      invoiceNumber: true,
      issueDate: true,
      status: true,
      sacCode: true,
      gstType: true,
      subtotal: true,
      cgst: true,
      sgst: true,
      igst: true,
      total: true,
      companyGst: true,
      yaanaGst: true,
      paidAt: true,
      company: { select: { name: true, gstNumber: true, state: true } },
      booking: { select: { referenceNo: true, serviceType: true } },
    },
  });

  if (invoices.length === 0) {
    throw new AppError('No invoices found for the selected period.', 404);
  }

  const totals = invoices.reduce(
    (acc, inv) => ({
      subtotal: acc.subtotal + inr(inv.subtotal.toNumber()),
      cgst: acc.cgst + inr(inv.cgst.toNumber()),
      sgst: acc.sgst + inr(inv.sgst.toNumber()),
      igst: acc.igst + inr(inv.igst.toNumber()),
      total: acc.total + inr(inv.total.toNumber()),
    }),
    { subtotal: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }
  );

  const headers = [
    'Invoice No.',
    'Invoice Date',
    'Booking Ref.',
    'Service',
    'Client Company',
    'Client GSTIN',
    'Client State',
    'SAC Code',
    'GST Type',
    'Taxable Amount (₹)',
    'CGST 9% (₹)',
    'SGST 9% (₹)',
    'IGST 18% (₹)',
    'Total (₹)',
    'Status',
    'Paid On',
  ];

  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    format(new Date(inv.issueDate), 'dd-MM-yyyy'),
    inv.booking.referenceNo,
    SERVICE_LABELS[inv.booking.serviceType] ?? inv.booking.serviceType,
    inv.company.name,
    inv.company.gstNumber ?? inv.companyGst ?? '—',
    inv.company.state ?? '—',
    inv.sacCode,
    inv.gstType ?? 'CGST_SGST',
    inr(inv.subtotal.toNumber()),
    inr(inv.cgst.toNumber()),
    inr(inv.sgst.toNumber()),
    inr(inv.igst.toNumber()),
    inr(inv.total.toNumber()),
    inv.status,
    inv.paidAt ? format(new Date(inv.paidAt), 'dd-MM-yyyy') : '—',
  ]);

  rows.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    totals.subtotal,
    totals.cgst,
    totals.sgst,
    totals.igst,
    totals.total,
    '',
    '',
  ]);

  const wsData = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  styleHeader(wsData, headers.length);
  setColWidths(
    wsData,
    [18, 14, 16, 26, 30, 20, 16, 10, 12, 20, 14, 14, 14, 14, 12, 14]
  );

  const byCompany = new Map<
    string,
    {
      name: string;
      subtotal: number;
      cgst: number;
      sgst: number;
      igst: number;
      total: number;
      count: number;
    }
  >();
  invoices.forEach((inv) => {
    const key = inv.company.name;
    const existing = byCompany.get(key) ?? {
      name: key,
      subtotal: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
      count: 0,
    };
    byCompany.set(key, {
      name: key,
      subtotal: existing.subtotal + inr(inv.subtotal.toNumber()),
      cgst: existing.cgst + inr(inv.cgst.toNumber()),
      sgst: existing.sgst + inr(inv.sgst.toNumber()),
      igst: existing.igst + inr(inv.igst.toNumber()),
      total: existing.total + inr(inv.total.toNumber()),
      count: existing.count + 1,
    });
  });

  const summaryHeaders = [
    'Company',
    'Invoices',
    'Taxable Amount (₹)',
    'CGST (₹)',
    'SGST (₹)',
    'IGST (₹)',
    'Total (₹)',
  ];
  const summaryRows = Array.from(byCompany.values()).map((c) => [
    c.name,
    c.count,
    c.subtotal,
    c.cgst,
    c.sgst,
    c.igst,
    c.total,
  ]);

  const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows]);
  styleHeader(wsSummary, summaryHeaders.length);
  setColWidths(wsSummary, [32, 10, 22, 16, 16, 16, 16]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsData, 'GST Detail');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'By Company');

  const period = `${format(dateFrom, 'MMM-yyyy')}_to_${format(
    dateTo,
    'MMM-yyyy'
  )}`;
  sendXlsx(res, wb, `YT_GST_Report_${period}.xlsx`);
});

// ── 2. Booking Summary Report ─────────────────────────────────────────
export const bookingSummaryReport = catchAsync(
  async (req: Request, res: Response) => {
    const now = new Date();
    const dateFrom = parseDate(req.query.from, startOfMonth(now));
    const dateTo = parseDate(req.query.to, now);
    const companyId = req.query.companyId as string | undefined;
    const status = req.query.status as string | undefined;

    if (dateFrom > dateTo)
      throw new AppError('Start date must be before end date.', 400);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: dateFrom, lte: dateTo },
        ...(companyId && { companyId }),
        ...(status && { status: status as any }),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        referenceNo: true,
        status: true,
        serviceType: true,
        startDate: true,
        endDate: true,
        chauffeurName: true,
        chauffeurPhone: true,
        quotedAmount: true,
        finalAmount: true,
        passengerCount: true,
        createdAt: true,
        company: { select: { name: true } },
        user: { select: { name: true } },
        pickupCity: { select: { name: true, state: true } },
        vehicle: { select: { name: true, category: true, registration: true } },
      },
    });

    if (bookings.length === 0) {
      throw new AppError('No bookings found for the selected period.', 404);
    }

    const headers = [
      'Ref No.',
      'Status',
      'Service Type',
      'Company',
      'Booked By',
      'Start Date',
      'End Date',
      'City',
      'Vehicle',
      'Registration',
      'Chauffeur',
      'Chauffeur Phone',
      'Passengers',
      'Quoted Amount (₹)',
      'Final Amount (₹)',
      'Created On',
    ];

    const rows = bookings.map((b) => [
      b.referenceNo,
      b.status,
      SERVICE_LABELS[b.serviceType] ?? b.serviceType,
      b.company?.name ?? '—',
      b.user?.name ?? '—',
      format(new Date(b.startDate), 'dd-MM-yyyy'),
      b.endDate ? format(new Date(b.endDate), 'dd-MM-yyyy') : '—',
      b.pickupCity ? `${b.pickupCity.name}, ${b.pickupCity.state}` : '—',
      b.vehicle?.name ?? '—',
      b.vehicle?.registration ?? '—',
      b.chauffeurName ?? '—',
      b.chauffeurPhone ?? '—',
      b.passengerCount ?? '—',
      inr(b.quotedAmount?.toNumber() ?? 0),
      inr(b.finalAmount?.toNumber() ?? 0),
      format(new Date(b.createdAt), 'dd-MM-yyyy'),
    ]);

    const wsDetail = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    styleHeader(wsDetail, headers.length);
    setColWidths(
      wsDetail,
      [16, 12, 26, 30, 20, 13, 13, 22, 24, 14, 20, 16, 12, 20, 20, 13]
    );

    const statusCount: Record<string, number> = {};
    bookings.forEach((b) => {
      statusCount[b.status] = (statusCount[b.status] ?? 0) + 1;
    });

    const statusHeaders = ['Status', 'Count', '% of Total'];
    const total = bookings.length;
    const statusRows = Object.entries(statusCount).map(([s, c]) => [
      s,
      c,
      `${((c / total) * 100).toFixed(1)}%`,
    ]);

    const wsStatus = XLSX.utils.aoa_to_sheet([
      statusHeaders,
      ...statusRows,
      ['TOTAL', total, '100%'],
    ]);
    styleHeader(wsStatus, statusHeaders.length);
    setColWidths(wsStatus, [16, 10, 14]);

    const svcCount: Record<string, { count: number; revenue: number }> = {};
    bookings.forEach((b) => {
      const key = SERVICE_LABELS[b.serviceType] ?? b.serviceType;
      const ex = svcCount[key] ?? { count: 0, revenue: 0 };
      svcCount[key] = {
        count: ex.count + 1,
        revenue: ex.revenue + inr(b.finalAmount?.toNumber() ?? 0),
      };
    });

    const svcHeaders = ['Service Type', 'Bookings', 'Total Revenue (₹)'];
    const svcRows = Object.entries(svcCount).map(([s, v]) => [
      s,
      v.count,
      v.revenue,
    ]);
    const wsService = XLSX.utils.aoa_to_sheet([svcHeaders, ...svcRows]);
    styleHeader(wsService, svcHeaders.length);
    setColWidths(wsService, [28, 12, 20]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsDetail, 'All Bookings');
    XLSX.utils.book_append_sheet(wb, wsStatus, 'By Status');
    XLSX.utils.book_append_sheet(wb, wsService, 'By Service');

    const period = `${format(dateFrom, 'MMM-yyyy')}_to_${format(
      dateTo,
      'MMM-yyyy'
    )}`;
    sendXlsx(res, wb, `YT_Booking_Summary_${period}.xlsx`);
  }
);

// ── 3. Revenue Report ─────────────────────────────────────────────────
export const revenueReport = catchAsync(async (req: Request, res: Response) => {
  const months = Math.min(Number(req.query.months ?? 6), 24);
  const companyId = req.query.companyId as string | undefined;
  const now = new Date();
  const dateFrom = subMonths(startOfMonth(now), months - 1);

  const invoices = await prisma.invoice.findMany({
    where: {
      issueDate: { gte: dateFrom },
      status: { not: 'CANCELLED' },
      ...(companyId && { companyId }),
    },
    orderBy: { issueDate: 'asc' },
    select: {
      invoiceNumber: true, // Fixed: Added invoiceNumber to select block
      issueDate: true,
      subtotal: true,
      cgst: true,
      sgst: true,
      igst: true,
      total: true,
      status: true,
      company: { select: { name: true } },
    },
  });

  const monthLabels: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    monthLabels.push(format(subMonths(now, i), 'MMM yyyy'));
  }

  const monthlyTotals: Record<
    string,
    {
      subtotal: number;
      tax: number;
      total: number;
      paid: number;
      count: number;
    }
  > = {};
  monthLabels.forEach((m) => {
    monthlyTotals[m] = { subtotal: 0, tax: 0, total: 0, paid: 0, count: 0 };
  });

  invoices.forEach((inv) => {
    const label = format(new Date(inv.issueDate), 'MMM yyyy');
    if (!monthlyTotals[label]) return;
    
    // Fixed: calling .toNumber() on Decimal fields before calculation
    const tax = inr(inv.cgst.toNumber()) + inr(inv.sgst.toNumber()) + inr(inv.igst.toNumber());
    monthlyTotals[label].subtotal += inr(inv.subtotal.toNumber());
    monthlyTotals[label].tax += tax;
    monthlyTotals[label].total += inr(inv.total.toNumber());
    monthlyTotals[label].count += 1;
    if (inv.status === 'PAID') monthlyTotals[label].paid += inr(inv.total.toNumber());
  });

  const monthHeaders = [
    'Month',
    'Invoices',
    'Taxable Amount (₹)',
    'Tax (₹)',
    'Total Billed (₹)',
    'Total Paid (₹)',
    'Outstanding (₹)',
  ];
  const monthRows = monthLabels.map((m) => {
    const d = monthlyTotals[m];
    return [m, d.count, d.subtotal, d.tax, d.total, d.paid, d.total - d.paid];
  });

  const grand = Object.values(monthlyTotals).reduce(
    (acc, d) => ({
      count: acc.count + d.count,
      subtotal: acc.subtotal + d.subtotal,
      tax: acc.tax + d.tax,
      total: acc.total + d.total,
      paid: acc.paid + d.paid,
    }),
    { count: 0, subtotal: 0, tax: 0, total: 0, paid: 0 }
  );
  monthRows.push([
    'TOTAL',
    grand.count,
    grand.subtotal,
    grand.tax,
    grand.total,
    grand.paid,
    grand.total - grand.paid,
  ]);

  const wsMonthly = XLSX.utils.aoa_to_sheet([monthHeaders, ...monthRows]);
  styleHeader(wsMonthly, monthHeaders.length);
  setColWidths(wsMonthly, [14, 10, 22, 16, 20, 18, 18]);

  const byCompany: Record<
    string,
    { name: string; total: number; paid: number; count: number }
  > = {};
  invoices.forEach((inv) => {
    const key = inv.company.name;
    const ex = byCompany[key] ?? { name: key, total: 0, paid: 0, count: 0 };
    byCompany[key] = {
      name: key,
      total: ex.total + inr(inv.total.toNumber()),
      paid: ex.paid + (inv.status === 'PAID' ? inr(inv.total.toNumber()) : 0),
      count: ex.count + 1,
    };
  });

  const companyHeaders = [
    'Company',
    'Invoices',
    'Total Billed (₹)',
    'Total Paid (₹)',
    'Outstanding (₹)',
  ];
  const companyRows = Object.values(byCompany)
    .sort((a, b) => b.total - a.total)
    .map((c) => [c.name, c.count, c.total, c.paid, c.total - c.paid]);

  const wsCompany = XLSX.utils.aoa_to_sheet([companyHeaders, ...companyRows]);
  styleHeader(wsCompany, companyHeaders.length);
  setColWidths(wsCompany, [32, 10, 20, 18, 18]);

  const regHeaders = [
    'Invoice No.',
    'Month',
    'Company',
    'Taxable (₹)',
    'Tax (₹)',
    'Total (₹)',
    'Status',
  ];
  const regRows = invoices.map((inv) => [
    inv.invoiceNumber, // Fixed: Added invoiceNumber value (now available via select context)
    format(new Date(inv.issueDate), 'MMM yyyy'),
    inv.company.name,
    inr(inv.subtotal.toNumber()),
    inr(inv.cgst.toNumber()) + inr(inv.sgst.toNumber()) + inr(inv.igst.toNumber()),
    inr(inv.total.toNumber()),
    inv.status,
  ]);

  const wsReg = XLSX.utils.aoa_to_sheet([regHeaders, ...regRows]);
  styleHeader(wsReg, regHeaders.length);
  setColWidths(wsReg, [18, 12, 30, 16, 12, 14, 12]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly Revenue');
  XLSX.utils.book_append_sheet(wb, wsCompany, 'By Company');
  XLSX.utils.book_append_sheet(wb, wsReg, 'Invoice Register');

  const period = `${format(dateFrom, 'MMM-yyyy')}_to_${format(
    now,
    'MMM-yyyy'
  )}`;
  sendXlsx(res, wb, `YT_Revenue_Report_${period}.xlsx`);
});