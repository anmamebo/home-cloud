import axiosInstance from "@/config/axios";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AxiosErrorInterceptor = ({
  children,
}: {
  children: ReactNode;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const errInterceptor = (error: AxiosError) => {
      const { response, request, config } = error;

      if (response) {
        // Request was made and server responded with a status
        const status = response.status;
        const message = (response.data as { detail?: string }).detail;

        if (status === 400) {
          throw new Error(message || "Hubo un problema con la solicitud.");
        } else if (status === 401) {
          if (config?.url?.includes("/auth/me")) {
            logout();
            navigate("/iniciar-sesion");
          } else if (config?.url?.includes("/auth/login")) {
            throw new Error(
              message ||
                "Credenciales incorrectas. Por favor, inténtalo de nuevo."
            );
          }
        } else if (status === 404) {
          throw new Error(message || "No se encontró el recurso solicitado.");
        } else {
          throw new Error("Ocurrió un error al enviar la solicitud.");
        }
      } else if (request) {
        // Request was made but no response was received
        throw new Error(
          "No se recibió respuesta del servidor. Verifica tu conexión a Internet."
        );
      } else {
        // Something happened in setting up the request that triggered an error
        throw new Error(
          "Ocurrió un error al enviar la solicitud. Por favor, intenta de nuevo."
        );
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      errInterceptor
    );

    setIsSet(true);

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate, logout]);

  return isSet ? <>{children}</> : null;
};
