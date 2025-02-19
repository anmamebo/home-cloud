import {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "@/schemas/authSchemas";
import {
  ChangePasswordFormValues,
  EditProfileFormValues,
} from "@/schemas/userSchemas";
import axiosInstance from "@/services/api";

export const fetchAuthenticatedUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const updateAuthenticatedUser = async (data: EditProfileFormValues) => {
  const response = await axiosInstance.patch("/auth/me", data);
  return response.data;
};

export const register = async (data: RegisterFormValues) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginFormValues) => {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);

  const response = await axiosInstance.post("/auth/login", params);
  return response.data;
};

export const changePassword = async (data: ChangePasswordFormValues) => {
  const dataFormated = {
    old_password: data.password,
    new_password: data.newPassword,
  };

  const response = await axiosInstance.post(
    "/auth/change-password",
    dataFormated
  );

  if (response.status === 204) {
    return "Contraseña actualizada correctamente.";
  }

  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordFormValues) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);

  if (response.status === 204) {
    return "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.";
  }

  return response.data;
};

export const resetPassword = async (data: ResetPasswordFormValues) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};
