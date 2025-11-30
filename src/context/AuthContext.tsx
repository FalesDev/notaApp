import { createContext } from "react";
import type { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;
