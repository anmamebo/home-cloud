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
import { AuthHeader, forgotPassword } from "@/features/auth";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/schemas/authSchemas";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(
    async (values: ForgotPasswordFormValues) => {
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
            <AuthHeader
              title="Encuentra tu cuenta de HomeCloud"
              subtitle="¿Recuerdas tu contraseña?"
              linkText="Inicia sesión"
              linkTo="/iniciar-sesion"
            />

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
