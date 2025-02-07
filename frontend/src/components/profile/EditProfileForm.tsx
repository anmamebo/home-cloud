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
import { useAuth } from "@/hooks/useAuth";
import {
  fetchAuthenticatedUser,
  updateAuthenticatedUser,
} from "@/services/authService";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  username: z.string().nonempty("El nombre de usuario es requerido"),
  email: z
    .string()
    .nonempty("El correo electrónico es requerido")
    .email("El correo electrónico es inválido"),
});

export const EditProfileForm = () => {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetchAuthenticatedUser();

      form.reset({
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      notify.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await updateAuthenticatedUser(values);
        const { access_token } = response;

        login(access_token);

        notify.success("Información actualizada correctamente.");
      } catch (error) {
        notify.error(getErrorMessage(error));
        console.error(error);
      }
    }
  );

  if (isLoading) {
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
