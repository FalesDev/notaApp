import { useLogin } from "../hooks/useLogin";
import LoginHeader from "../components/auth/LoginHeader";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const { credentials, isLoading, error, handleChange, handleSubmit } =
    useLogin();

  return (
    <div className="h-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-gray-100 p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header Component */}
        <LoginHeader />

        {/* Form Component */}
        <LoginForm
          onSubmit={handleSubmit}
          onChange={handleChange}
          credentials={credentials}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}