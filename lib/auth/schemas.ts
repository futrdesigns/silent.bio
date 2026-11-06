import { z } from 'zod';
import { validateUsername } from '@/lib/security/username-safety';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(24, 'Username cannot exceed 24 characters')
    .refine((val) => validateUsername(val).valid, {
      message: 'Invalid or reserved username',
    }),
  displayName: z.string().min(1, 'Display name is required').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const usernameClaimSchema = z.object({
  username: z.string(),
});
