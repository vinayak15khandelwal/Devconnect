import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Placeholder landing page for logged-in users — the real dashboard
// (activity feed, suggestions, stats) gets built out on Day 13.
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <p className="text-gray-700 dark:text-gray-300">
            Welcome, <span className="font-semibold">{user?.name}</span> (@{user?.username})
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Auth is wired up — dashboard content comes later.</p>
        </div>
      </div>
    </div>
  );
}
