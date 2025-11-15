import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal tidak valid'
  }),
  gender: z.enum(['L', 'P'], {
    errorMap: () => ({ message: 'Gender harus L atau P' })
  }),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional()
});