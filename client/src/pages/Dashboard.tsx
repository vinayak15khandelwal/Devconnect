import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Placeholder landing page for logged-in users — the real dashboard
// (activity feed, suggestions, stats) gets built out on Day 13.
export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-brand-700">DevConnect</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/search" className="text-brand-600 hover:underline">
              Find devs
            </Link>
            <Link to="/blog" className="text-brand-600 hover:underline">
              Blog
            </Link>
            <Link to={`/u/${user?.username}`} className="text-brand-600 hover:underline">
              My profile
            </Link>
            <button onClick={logout} className="text-gray-500 hover:text-gray-800">
              Log out
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-700">
            Welcome, <span className="font-semibold">{user?.name}</span> (@{user?.username})
          </p>
          <p className="text-sm text-gray-400 mt-1">Auth is wired up — dashboard content comes later.</p>
        </div>
      </div>
    </div>
  );
}
