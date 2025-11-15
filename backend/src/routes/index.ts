import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import visitRoutes from './visit.routes';
import patientRoutes from './patient.routes';
import scheduleRoutes from './schedule.routes';
import leaveRoutes from './leave.routes';
import commissionRoutes from './commission.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctor/dashboard', dashboardRoutes);
router.use('/doctor/visits', visitRoutes);
router.use('/doctor/patients', patientRoutes);
router.use('/doctor/schedules', scheduleRoutes);
router.use('/doctor/leaves', leaveRoutes);
router.use('/doctor/finance/commissions', commissionRoutes);

export default router;