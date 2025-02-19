import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/features/auth";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/authSchemas";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthHeader } from "./AuthHeader";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      new_password: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(
    async (values: ResetPasswordFormValues) => {
      setErrorMessage(null);

      try {
        await resetPassword(values);
        navigate("/iniciar-sesion");
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
              title="Reinicia y vuelve al control de tu cuenta"
              subtitle="¿Recuerdas tu contraseña?"
              linkText="Inicia sesión"
              linkTo="/iniciar-sesion"
            />

            {/* Form fields */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="text-sm font-semibold text-red-500">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" className="w-full">
                Restablecer contraseña
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
