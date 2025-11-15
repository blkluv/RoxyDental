import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authMiddleware, paymentController.createPayment);
router.get('/visit/:visitId', authMiddleware, paymentController.getPaymentsByVisit);
router.get('/:id', authMiddleware, paymentController.getPaymentById);

export default router;