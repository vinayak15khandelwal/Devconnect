import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Wraps routes that require a logged-in user. Shows nothing meaningful
// while the initial /api/auth/me check is in flight, then redirects to
// /login if it comes back empty.
export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center text-gray-400", children: "Loading..." }));
    }
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(Outlet, {});
}
