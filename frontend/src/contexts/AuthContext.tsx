import { User } from "@/types/UserTypes";
import { createContext } from "react";

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
