import { ERROR_MESSAGES } from "@/constants/FormErrorConstants";
import { z } from "zod";

// Schemas
export const changeNameSchema = z.object({
  name: z.string().trim().nonempty(ERROR_MESSAGES.REQUIRED),
});

export const uploadFileSchema = z.object({
  file: z.instanceof(File, { message: ERROR_MESSAGES.REQUIRED_FILE }),
});

export const createFolderSchema = z.object({
  name: z.string().trim().nonempty(ERROR_MESSAGES.REQUIRED),
});

// Types
export type ChangeNameFormValues = z.infer<typeof changeNameSchema>;
export type UploadFileFormValues = z.infer<typeof uploadFileSchema>;
export type CreateFolderFormValues = z.infer<typeof createFolderSchema>;
