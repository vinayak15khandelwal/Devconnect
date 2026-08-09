import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginWithGithub } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-brand-700 mb-1">DevConnect</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to your account</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit" disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md py-2 transition"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px bg-gray-200 flex-1" /> OR <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          onClick={loginWithGithub}
          className="w-full border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-md py-2 transition"
        >
          Continue with GitHub
        </button>

        <p className="mt-6 text-sm text-gray-500 text-center">
          No account?{" "}
          <Link to="/register" className="text-brand-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
