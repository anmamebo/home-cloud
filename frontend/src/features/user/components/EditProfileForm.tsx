import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { updateAuthenticatedUser } from "@/features/auth";
import {
  EditProfileFormValues,
  editProfileSchema,
} from "@/schemas/userSchemas";

import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const EditProfileForm = () => {
  const { user, login } = useAuth();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: EditProfileFormValues) => {
    try {
      const response = await updateAuthenticatedUser(values);
      const { access_token } = response;

      login(access_token);
      notify.success("Información actualizada correctamente.");
    } catch (error) {
      notify.error(getErrorMessage(error));
      console.error(error);
    }
  });

  if (!user) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          {/* Form fields */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="usuario1234@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
