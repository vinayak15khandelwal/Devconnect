import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Placeholder landing page for logged-in users — the real dashboard
// (activity feed, suggestions, stats) gets built out on Day 13.
export default function Dashboard() {
    const { user, logout } = useAuth();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 px-6 py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700", children: "DevConnect" }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsx(Link, { to: "/blog", className: "text-brand-600 hover:underline", children: "Blog" }), _jsx(Link, { to: `/u/${user?.username}`, className: "text-brand-600 hover:underline", children: "My profile" }), _jsx("button", { onClick: logout, className: "text-gray-500 hover:text-gray-800", children: "Log out" })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm p-6", children: [_jsxs("p", { className: "text-gray-700", children: ["Welcome, ", _jsx("span", { className: "font-semibold", children: user?.name }), " (@", user?.username, ")"] }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Auth is wired up \u2014 dashboard content comes later." })] })] }) }));
}
