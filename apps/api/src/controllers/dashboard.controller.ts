// Path: apps/api/src/controllers/dashboard.controller.ts
//
// GET /api/admin/dashboard
// Returns all data needed for the dashboard in a single request:
//   - 4 stat cards
//   - bookings by month (last 6 months) for bar chart
//   - recent 10 bookings for the table

import prisma from '../lib/prisma';
import { Request, Response } from 'express';
import { catchAsync } from '../middleware/errorHandler';
import { startOfMonth, subMonths, format } from 'date-fns';

export const getDashboard = catchAsync(async (_req: Request, res: Response) => {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);

  // ── Run all queries in parallel for speed ──────────────────────────
  const [
    totalBookings,
    activeTrips,
    totalCompanies,
    revenueThisMonth,
    bookingsByMonth,
    recentBookings,
  ] = await Promise.all([
    // 1. Total bookings (all time, all statuses)
    prisma.booking.count(),

    // 2. Active trips right now
    prisma.booking.count({
      where: { status: { in: ['ONGOING', 'CONFIRMED'] } },
    }),

    // 3. Active corporate companies
    prisma.company.count({
      where: { status: 'ACTIVE' },
    }),

    // 4. Revenue this month — sum of PAID invoice totals
    prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        paidAt: { gte: startOfThisMonth },
      },
      _sum: { total: true },
    }),

    // 5. Bookings count per month for last 6 months
    //    We fetch completed bookings in the window, group in JS
    prisma.booking.findMany({
      where: {
        createdAt: { gte: subMonths(now, 6) },
        status: { in: ['COMPLETED', 'ONGOING', 'CONFIRMED'] },
      },
      select: { createdAt: true },
    }),

    // 6. Recent 10 bookings for the table
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        referenceNo: true,
        status: true,
        serviceType: true,
        startDate: true,
        quotedAmount: true,
        finalAmount: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
        pickupCity: { select: { name: true } },
        vehicle: { select: { name: true, category: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  // ── Build monthly chart data ───────────────────────────────────────
  // Create a map of the last 6 month labels with 0 counts
  const monthMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const label = format(subMonths(now, i), 'MMM yyyy'); // e.g. "Jan 2025"
    monthMap[label] = 0;
  }

  // Count bookings into their respective month bucket
  for (const b of bookingsByMonth) {
    const label = format(b.createdAt, 'MMM yyyy');
    if (label in monthMap) {
      monthMap[label]++;
    }
  }

  const chartData = Object.entries(monthMap).map(([month, count]) => ({
    month,
    bookings: count,
  }));

  // ── Response ──────────────────────────────────────────────────────
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalBookings,
        activeTrips,
        totalCompanies,
        revenueMtd: Number(revenueThisMonth._sum.total ?? 0),
      },
      chartData,
      recentBookings,
    },
  });
});
