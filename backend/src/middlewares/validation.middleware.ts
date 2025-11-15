import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response.util';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate
      const validated = schema.parse(req.body);
      req.body = validated; // Replace body with validated data
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.') || 'unknown',
          message: err.message
        }));
        return res.status(400).json(errorResponse('Validasi gagal', errors));
      }
      
      // For non-Zod errors
      return res.status(400).json(errorResponse('Validasi gagal', error.message));
    }
  };
};