import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const patientController = new PatientController();

router.get('/', authMiddleware, patientController.getPatients);
router.get('/:id', authMiddleware, patientController.getPatientById);
router.get('/:id/records', authMiddleware, patientController.getPatientRecords);
router.post('/:id/records', authMiddleware, patientController.createTreatment);

export default router;