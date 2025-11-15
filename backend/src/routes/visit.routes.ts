import { Router } from 'express';
import { VisitController } from '../controllers/visit.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const visitController = new VisitController();

router.get('/', authMiddleware, visitController.getVisits);
router.get('/queue', authMiddleware, visitController.getQueue);
router.get('/:id', authMiddleware, visitController.getVisitById);
router.post('/', authMiddleware, visitController.createVisit);

export default router;