import { ERROR_MESSAGES } from "@/constants/FormErrorConstants";
import { z } from "zod";

// Schemas
export const loginSchema = z.object({
  username: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
  password: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
});

export const registerSchema = z.object({
  username: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
  email: z
    .string()
    .nonempty(ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
  password: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
});

export const resetPasswordSchema = z.object({
  token: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
  new_password: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty(ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
});

// Types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
