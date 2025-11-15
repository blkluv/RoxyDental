import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AuthRequest } from '../types/express.types';
import { errorResponse } from '../utils/response.util';
import { prisma } from '../config/database';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Token tidak ditemukan'));
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        fullName: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json(errorResponse('User tidak ditemukan'));
    }

    if (!user.isActive) {
      return res.status(403).json(errorResponse('Akun tidak aktif'));
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Token tidak valid'));
  }
};