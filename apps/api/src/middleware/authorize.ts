// Path: apps/api/src/middleware/authorize.ts
//
// Role-based access control. Always used AFTER authenticate.
//
// Usage — single role:
//   router.post('/companies', authenticate, authorize('YAANA_ADMIN'), createCompany);
//
// Usage — multiple roles allowed:
//   router.get('/bookings', authenticate, authorize('YAANA_ADMIN', 'CORPORATE_ADMIN'), getBookings);
//
// The Role enum values from Prisma:
//   YAANA_ADMIN      → Yaanainternal staff (full access)
//   CORPORATE_ADMIN  → Client company admin (scoped to their company)
//   CORPORATE_USER   → Client employee (scoped to their bookings only)

import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from './errorHandler';

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // authenticate must run before authorize
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
}
