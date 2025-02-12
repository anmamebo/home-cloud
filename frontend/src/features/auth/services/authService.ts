import axiosInstance from "@/config/axios";

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

type ChangePasswordData = {
  old_password: string;
  new_password: string;
};

type ResetPasswordData = {
  token: string;
  new_password: string;
};

type UpdateUserData = {
  username: string;
  email: string;
};

export const fetchAuthenticatedUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const updateAuthenticatedUser = async (data: UpdateUserData) => {
  const response = await axiosInstance.patch("/auth/me", data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);

  const response = await axiosInstance.post("/auth/login", params);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.post("/auth/change-password", data);

  if (response.status === 204) {
    return "Contraseña actualizada correctamente.";
  }

  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);

  if (response.status === 204) {
    return "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.";
  }

  return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};
