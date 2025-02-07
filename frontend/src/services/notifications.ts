import { toast } from "sonner";

export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description: description,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description: description,
    });
  },
};
