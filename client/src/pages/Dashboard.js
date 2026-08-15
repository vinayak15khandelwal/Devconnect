import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
// Placeholder landing page for logged-in users — the real dashboard
// (activity feed, suggestions, stats) gets built out on Day 13.
export default function Dashboard() {
    const { user } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsx("div", { className: "max-w-2xl mx-auto px-6 py-8", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6", children: [_jsxs("p", { className: "text-gray-700 dark:text-gray-300", children: ["Welcome, ", _jsx("span", { className: "font-semibold", children: user?.name }), " (@", user?.username, ")"] }), _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "Auth is wired up \u2014 dashboard content comes later." })] }) })] }));
}
