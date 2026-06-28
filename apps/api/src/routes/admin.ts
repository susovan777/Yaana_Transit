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
  createCompany,
  listCompanies,
  getCompany,
  updateCompany,
  inviteUser,
  listUsers,
  updateUserStatus,
  resendInvite,
} from '../controllers/admin.controller';
import { getDashboard } from '@/controllers/dashboard.controller';

const router: Router = Router();

// Every admin route requires: valid JWT + YAANA_ADMIN role
router.use(authenticate, authorize('YAANA_ADMIN'));
router.get('/dashboard', getDashboard);

// ── Companies ─────────────────────────────────────────────────────────
router.post('/companies', validate(createCompanySchema), createCompany);
router.get('/companies', listCompanies);
router.get('/companies/:id', getCompany);
router.patch('/companies/:id', validate(updateCompanySchema), updateCompany);

// ── Users ─────────────────────────────────────────────────────────────
router.post('/users/invite', validate(inviteUserSchema), inviteUser);
router.get('/users', listUsers);
router.patch(
  '/users/:id/status',
  validate(updateUserStatusSchema),
  updateUserStatus
);
router.post('/users/:id/resend-invite', resendInvite);

export default router;
