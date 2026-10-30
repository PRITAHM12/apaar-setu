import { z } from 'zod';

export const APAAR_ID_REGEX = /^\d{4}-\d{4}-\d{4}$/;

export const ApaarIdSchema = z
  .string()
  .trim()
  .regex(APAAR_ID_REGEX, {
    message: 'Invalid APAAR ID format. Must match XXXX-XXXX-XXXX (12 digits separated by hyphens).',
  });

export const StudentBatchRowSchema = z.object({
  apaarId: ApaarIdSchema,
  fullName: z.string().min(2, 'Student name too short').max(100),
  semester: z.number().int().min(1).max(12),
  sgpa: z.number().min(0.0).max(10.0),
  cgpa: z.number().min(0.0).max(10.0),
  credits: z.number().int().min(0).max(40),
  program: z.string().min(3),
});

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>'"`;()]/g, '')
    .replace(/--|\/\*|\*\/|union|select|insert|drop|delete|update/gi, '')
    .trim();
}

export function validateApaarId(id: string): { valid: boolean; error?: string } {
  const result = ApaarIdSchema.safeParse(id);
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message };
  }
  return { valid: true };
}
