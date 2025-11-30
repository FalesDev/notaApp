import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../context/useAuth";

export function useLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Please complete all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email");
      return;
    }
    if (credentials.password.length < 6) {
      setError("Password is too short");
      return;
    }

    // Login API
    try {
      setIsLoading(true);
      await login(credentials);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error logging in";
      setError(errorMessage);
      setCredentials((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
}