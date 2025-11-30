import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { UserRole } from '../../generated/prisma';

const router = Router();
const userController = new UserController();

// Admin/Dokter only routes
router.get(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.getAllUsers
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.getUserById
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.createUser
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.updateUser
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.deleteUser
);

router.patch(
  '/:id/toggle-status',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.toggleUserStatus
);

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.getProfile
);

router.put(
  '/profile',
  authMiddleware,
  roleMiddleware(UserRole.DOKTER),
  userController.updateProfile
);

export default router;