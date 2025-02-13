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
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudyIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  token: z.string().nonempty("El token es requerido"),
  new_password: z.string().nonempty("La nueva contraseña es requerida"),
});

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token || "",
      new_password: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
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
                Reinicia y vuelve al control de tu cuenta
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
