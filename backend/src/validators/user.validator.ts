import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  role: z.enum(['DOKTER', 'PERAWAT'], {
    errorMap: () => ({ message: 'Role harus DOKTER atau PERAWAT' })
  }),
  specialization: z.string().optional()
});

export const updateUserSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional(),
  specialization: z.string().optional(),
  isActive: z.boolean().optional()
});