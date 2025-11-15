import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const leaveController = new LeaveController();

router.get('/', authMiddleware, leaveController.getLeaveRequests);
router.post('/', authMiddleware, leaveController.createLeaveRequest);

export default router;