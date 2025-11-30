import type { ChangeEvent, FormEvent } from "react";

interface LoginFormProps {
  onSubmit: (e: FormEvent) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  credentials: { email: string; password: string };
  isLoading: boolean;
  error: string | null;
}

export default function LoginForm({
  onSubmit,
  onChange,
  credentials,
  isLoading,
  error,
}: LoginFormProps) {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative block w-full rounded-lg border border-gray-300 p-3 text-black placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm"
            placeholder="Email"
            value={credentials.email}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="relative block w-full rounded-lg border border-gray-300 p-3 text-black placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm"
            placeholder="Password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-200 border border-red-800 text-center">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative flex w-full justify-center rounded-lg py-3 px-4 text-sm font-semibold text-white transition-all 
            ${
              isLoading
                ? "bg-yellow-600 cursor-not-allowed opacity-70"
                : "bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Connecting...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </form>
  );
}