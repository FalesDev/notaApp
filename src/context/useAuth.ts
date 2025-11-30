import { useContext } from "react";
import AuthContext from "./AuthContext";
import type { AuthContextType } from "../types/auth";

export default function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
