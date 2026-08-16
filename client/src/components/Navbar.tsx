import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const LINKS = [
  { to: "/dashboard", label: "Home" },
  { to: "/search", label: "Discover" },
  { to: "/connections", label: "Connections" },
  { to: "/blog", label: "Blog" },
];

// Single shared header for every authenticated page. Renders nothing for
// the nav links if there's no logged-in user yet (brief loading window),
// rather than showing authenticated-only links to a logged-out visitor.
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="text-lg font-bold text-brand-700 dark:text-brand-400 shrink-0">
          DevConnect
        </Link>

        {user && (
          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "px-3 py-1.5 rounded-md whitespace-nowrap transition " +
                  (isActive(link.to)
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <Link
              to={`/u/${user.username}`}
              className={
                "text-sm px-3 py-1.5 rounded-md transition " +
                (isActive(`/u/${user.username}`)
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700")
              }
            >
              My profile
            </Link>
          )}
          <ThemeToggle />
          {user && <NotificationBell />}
          {user && (
            <button
              onClick={logout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
