import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
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
//
// Below the `sm` breakpoint the link list + profile/logout collapse into a
// hamburger-triggered dropdown; icon buttons (theme, notifications) stay
// visible at all sizes since they're compact and used constantly.
export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    function isActive(path) {
        return location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));
    }
    const linkClass = (path, extra = "") => "px-3 py-2.5 sm:py-1.5 rounded-md whitespace-nowrap transition " +
        (isActive(path)
            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700") +
        " " + extra;
    return (_jsxs("header", { className: "bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20", children: [_jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4", children: [_jsx(Link, { to: "/dashboard", className: "text-lg font-bold text-brand-700 dark:text-brand-400 shrink-0", children: "DevConnect" }), user && (_jsx("nav", { className: "hidden sm:flex items-center gap-1 overflow-x-auto text-sm", children: LINKS.map((link) => (_jsx(Link, { to: link.to, className: linkClass(link.to), children: link.label }, link.to))) })), _jsxs("div", { className: "flex items-center gap-2 sm:gap-3 shrink-0", children: [user && (_jsx(Link, { to: `/u/${user.username}`, className: "hidden sm:block text-sm " + linkClass(`/u/${user.username}`), children: "My profile" })), _jsx(ThemeToggle, {}), user && _jsx(NotificationBell, {}), user && (_jsx("button", { onClick: logout, className: "hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-1", children: "Log out" })), user && (_jsx("button", { onClick: () => setMobileOpen((v) => !v), "aria-label": mobileOpen ? "Close menu" : "Open menu", "aria-expanded": mobileOpen, className: "sm:hidden w-11 h-11 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition", children: mobileOpen ? (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] })) : (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] })) }))] })] }), user && mobileOpen && (_jsxs("nav", { className: "sm:hidden border-t border-gray-100 dark:border-gray-700 px-4 py-2 flex flex-col gap-1 text-sm", children: [LINKS.map((link) => (_jsx(Link, { to: link.to, onClick: () => setMobileOpen(false), className: linkClass(link.to), children: link.label }, link.to))), _jsx(Link, { to: `/u/${user.username}`, onClick: () => setMobileOpen(false), className: linkClass(`/u/${user.username}`), children: "My profile" }), _jsx("button", { onClick: () => {
                            setMobileOpen(false);
                            logout();
                        }, className: "text-left px-3 py-2.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700", children: "Log out" })] }))] }));
}
