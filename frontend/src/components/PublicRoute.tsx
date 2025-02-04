import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
