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

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  token: string;
  new_password: string;
};

const handleAxiosError = (error: AxiosError): never => {
  if (error.response) {
    // Server responded with a status code different from 2xx
    const { status } = error.response;

    switch (status) {
      case 400:
        throw new Error(
          "El nombre de usuario o correo electrónico ya están en uso. Por favor, elige otro."
        );
      case 401:
        throw new Error(
          "Credenciales incorrectas. Por favor, inténtalo de nuevo."
        );
      case 422:
        throw new Error(
          "La información proporcionada es inválida. Por favor, verifica tus datos."
        );
      default:
        throw new Error(
          `Ocurrió un error al enviar la solicitud. Por favor, inténtalo más tarde.`
        );
    }
  } else if (error.request) {
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
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
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
    handleAxiosError(error as AxiosError);
  }
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", data);

    if (response.status === 204) {
      return "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.";
    }

    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};

export const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
};
