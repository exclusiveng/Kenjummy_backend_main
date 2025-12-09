import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, { message: 'Full name is required' }).min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, { message: 'Email is required' }).email('Invalid email address'),
    phone: z.string().min(1, { message: 'Phone number is required' }).min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(1, { message: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
    superadminSecret: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }).email('Invalid email address'),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];