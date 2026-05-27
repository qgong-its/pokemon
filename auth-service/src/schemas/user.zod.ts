import { z } from 'zod';
import { objectIdZodSchema } from './common/objectId.zod.ts';

export const userNameZodSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(20, 'Name is too long');

export const emailZodSchema = z
  .email('Email is not valid')
  .trim()
  .toLowerCase();

export const passwordZodSchema = z
  .string('password must be a string')
  .trim()
  .min(8, 'password must be at least 8 characters long')
  .max(64, 'password must be at most 64 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}|;:'",.<>?`~]).+$/,
    'Password must include lowercase, uppercase, number and special character',
  );

export const isActiveZodSchema = z.boolean();

export const userIdParamsZodSchema = z
  .object({
    id: objectIdZodSchema,
  })
  .strict();

export type UserIdParamsZodDTO = z.infer<typeof userIdParamsZodSchema>;

export const createUserZodSchema = z
  .object({
    name: userNameZodSchema,
    email: emailZodSchema,
    password: passwordZodSchema,
  })
  .strict();

export type CreateUserZodDTO = z.infer<typeof createUserZodSchema>;

export const updateUserZodSchema = createUserZodSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type UpdateUserZodDTO = z.infer<typeof updateUserZodSchema>;
