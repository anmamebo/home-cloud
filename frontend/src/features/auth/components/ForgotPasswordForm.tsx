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
import { forgotPassword } from "@/features/auth";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudyIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .nonempty("El correo electrónico es requerido")
    .email("El correo electrónico es inválido"),
});

export const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      setSuccessMessage(null);
      setErrorMessage(null);

      try {
        const response = await forgotPassword(values);
        setSuccessMessage(response);
        form.reset();
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        console.error(error);

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    }
  );

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            {/* Logo and title */}
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <CloudyIcon className="size-6" />
                </div>
                <span className="sr-only">HomeCloud</span>
              </a>

              <h1 className="text-xl font-bold">
                Encuentra tu cuenta de HomeCloud
              </h1>

              <div className="text-center text-sm">
                ¿Recuerdas tu contraseña?{" "}
                <Link
                  to="/iniciar-sesion"
                  className="underline underline-offset-4"
                >
                  Inicia sesión
                </Link>
              </div>
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-6">
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

              {/* Success message */}
              {successMessage && (
                <div className="text-sm font-semibold text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div className="text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" className="w-full">
                Enviar correo de recuperación
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
