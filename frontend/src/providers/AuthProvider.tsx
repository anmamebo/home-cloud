import { AuthContext } from "@/contexts/AuthContext";
import { fetchAuthenticatedUser } from "@/services/authService";
import { User } from "@/types/UserTypes";
import { ReactNode, useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const response = await fetchAuthenticatedUser();
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data", error);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
