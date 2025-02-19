import { ERROR_MESSAGES } from "@/constants/FormErrorConstants";
import { z } from "zod";

// Schemas
export const changePasswordSchema = z
  .object({
    password: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
    newPassword: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
    confirmNewPassword: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: ERROR_MESSAGES.NON_EQUAL_PASSWORDS,
    path: ["confirmNewPassword"],
  });

export const editProfileSchema = z.object({
  username: z.string().nonempty(ERROR_MESSAGES.REQUIRED),
  email: z
    .string()
    .nonempty(ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
});

// Types
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
