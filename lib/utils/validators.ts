import { z } from 'zod';

export const loginSchema = z.object({
  mobile_number: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string().min(1, 'Password is required').max(128),
});

export const uuidSchema = z.string().uuid('Invalid ID format');

export const startConsultationSchema = z.object({
  module_id: z.string().min(1).max(50),
});

export const endConsultationSchema = z.object({
  consultation_id: uuidSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StartConsultationInput = z.infer<typeof startConsultationSchema>;
export type EndConsultationInput = z.infer<typeof endConsultationSchema>;
