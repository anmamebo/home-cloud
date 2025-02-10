import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
