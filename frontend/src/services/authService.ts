import axiosInstance from "@/config/axios";
import { AxiosError } from "axios";

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);

    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;

    if (errorResponse.response) {
      // Server responded with a status code different from 2xx
      const { status } = errorResponse.response;

      if (status === 400) {
        throw new Error(
          "El nombre de usuario o correo electrónico ya están en uso. Por favor, elige otro."
        );
      } else {
        throw new Error(
          `Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde.`
        );
      }
    } else if (errorResponse.request) {
      // Request was made but no response was received
      throw new Error(
        "No se recibió respuesta del servidor. Verifica tu conexión a Internet."
      );
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error(
        "Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde."
      );
    }
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const params = new URLSearchParams();
    params.append("username", data.username);
    params.append("password", data.password);

    const response = await axiosInstance.post("/auth/login", params);

    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;

    if (errorResponse.response) {
      // Server responded with a status code different from 2xx
      const { status } = errorResponse.response;

      if (status === 401) {
        throw new Error(
          "Credenciales incorrectas. Por favor, inténtalo de nuevo."
        );
      } else {
        throw new Error(
          `Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde.`
        );
      }
    } else if (errorResponse.request) {
      // Request was made but no response was received
      throw new Error(
        "No se recibió respuesta del servidor. Verifica tu conexión a Internet."
      );
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error(
        "Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde."
      );
    }
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", data);

    if (response.status === 204) {
      return "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.";
    }

    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;

    if (errorResponse.response) {
      // Server responded with a status code different from 2xx
      throw new Error(
        `Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde.`
      );
    } else if (errorResponse.request) {
      // Request was made but no response was received
      throw new Error(
        "No se recibió respuesta del servidor. Verifica tu conexión a Internet."
      );
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error(
        "Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde."
      );
    }
  }
};

export const resetPassword = async (data: {
  token: string;
  new_password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", data);

    return response.data;
  } catch (error) {
    const errorResponse = error as AxiosError;

    if (errorResponse.response) {
      // Server responded with a status code different from 2xx
      throw new Error(
        `Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde.`
      );
    } else if (errorResponse.request) {
      // Request was made but no response was received
      throw new Error(
        "No se recibió respuesta del servidor. Verifica tu conexión a Internet."
      );
    } else {
      // Something happened in setting up the request that triggered an error
      throw new Error(
        "Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde."
      );
    }
  }
};
