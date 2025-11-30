import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import AuthContext from "./AuthContext";
import api from "../utils/api";
import type { User } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    navigate("/");
  }, [navigate]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return false;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data } = await api.get<User>("/api/v1/auth/me");

      setUser(data);
      return true;
    } catch (error) {
      console.error("Error de autenticación:", error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(
    async (credentials: { email: string; password: string }): Promise<void> => {
      try {
        const response = await api.post("/api/v1/auth/login", credentials);

        const token = response.data.token || response.data.accessToken;
        localStorage.setItem("token", token);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        await checkAuth();

        navigate("/");
      } catch (error) {
        let errorMessage = "Error al iniciar sesión";

        if (error instanceof AxiosError) {
          if (error.response) {
            switch (error.response.status) {
              case 400:
                errorMessage = "Invalid data";
                break;
              case 401:
                errorMessage = "Incorrect credentials";
                break;
              case 500:
                errorMessage = "Server error";
                break;
              default:
                errorMessage =
                  error.response.data?.message || "Unknown error";
            }
          } else if (error.request) {
            errorMessage = "No response from server";
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        throw new Error(errorMessage);
      }
    },
    [checkAuth, navigate]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      checkAuth,
      logout,
    }),
    [user, loading, login, checkAuth, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
