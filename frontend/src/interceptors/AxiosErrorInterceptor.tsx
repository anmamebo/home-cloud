import axiosInstance from "@/config/axios";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const handleError = (error: AxiosError) => {
  const { response, request } = error;

  if (response) {
    // Request was made and server responded with a status
    const status = response.status;
    const message = (response.data as { detail?: string })?.detail;

    const errorMessages: { [key: number]: string } = {
      400: message || "Hubo un problema con la solicitud.",
      401: message || "No autorizado. Por favor, inicia sesión nuevamente.",
      404: message || "No se encontró el recurso solicitado.",
      500: "Ocurrió un error en el servidor. Por favor, inténtalo más tarde.",
    };

    throw new Error(
      errorMessages[status] || "Ocurrió un error al enviar la solicitud."
    );
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
};

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
      const { config, status } = error;

      if (status === 401 && !config?.url?.includes("/auth/login")) {
        logout();
        navigate("/iniciar-sesion");
        return Promise.reject(
          new Error("No autorizado. Por favor, inicia sesión.")
        );
      }

      handleError(error);
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
