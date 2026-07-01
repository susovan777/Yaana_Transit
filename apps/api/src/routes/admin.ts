// Path: apps/api/src/routes/admin.ts

import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

import {
  createCompanySchema,
  inviteUserSchema,
  updateUserStatusSchema,
  updateCompanySchema,
} from '../schemas/admin.schema';
import {
  createVehicleSchema,
  updateVehicleSchema,
} from '../schemas/fleet.schema';
import {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from '../schemas/booking.schema';

import {
  createCompany,
  listCompanies,
  getCompany,
  updateCompany,
  inviteUser,
  listUsers,
  updateUserStatus,
  resendInvite,
} from '../controllers/admin.controller';
import { getDashboard } from '../controllers/dashboard.controller';
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  toggleVehicle,
  deleteVehicle,
} from '../controllers/fleet.controller';
import {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
} from '../controllers/booking.controller';

const router: Router = Router();
router.use(authenticate, authorize('YAANA_ADMIN'));

// Dashboard
router.get('/dashboard', getDashboard);

// Companies
router.post('/companies', validate(createCompanySchema), createCompany);
router.get('/companies', listCompanies);
router.get('/companies/:id', getCompany);
router.patch('/companies/:id', validate(updateCompanySchema), updateCompany);

// Users
router.post('/users/invite', validate(inviteUserSchema), inviteUser);
router.get('/users', listUsers);
router.patch(
  '/users/:id/status',
  validate(updateUserStatusSchema),
  updateUserStatus
);
router.post('/users/:id/resend-invite', resendInvite);

// Fleet
router.get('/fleet', listVehicles);
router.get('/fleet/:id', getVehicle);
router.post('/fleet', validate(createVehicleSchema), createVehicle);
router.patch('/fleet/:id', validate(updateVehicleSchema), updateVehicle);
router.patch('/fleet/:id/toggle', toggleVehicle);
router.delete('/fleet/:id', deleteVehicle);

// Bookings
router.get('/bookings', listBookings);
router.get('/bookings/:id', getBooking);
router.post('/bookings', validate(createBookingSchema), createBooking);
router.patch('/bookings/:id', validate(updateBookingSchema), updateBooking);
router.patch(
  '/bookings/:id/status',
  validate(updateBookingStatusSchema),
  updateBookingStatus
);

export default router;
