import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-8 w-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-bg)] font-bold text-sm">
            IA
          </div>
          <span className="font-semibold text-lg tracking-tight">InterviewAI</span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Welcome back. Continue your interview prep.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-[var(--color-primary)] py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
