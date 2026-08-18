import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// Route-level code splitting: each page ships as its own chunk, fetched
// only when the person navigates there, instead of one ~460KB bundle
// loaded up front for a Login screen that needs none of it.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogEditor = lazy(() => import("./pages/BlogEditor"));
const Search = lazy(() => import("./pages/Search"));
const Connections = lazy(() => import("./pages/Connections"));
function PageFallback() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500", children: "Loading..." }));
}
export default function App() {
    return (_jsx(Suspense, { fallback: _jsx(PageFallback, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/u/:username", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/blog", element: _jsx(BlogList, {}) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(BlogPost, {}) }), _jsx(Route, { path: "/search", element: _jsx(Search, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/connections", element: _jsx(Connections, {}) }), _jsx(Route, { path: "/blog/new", element: _jsx(BlogEditor, {}) }), _jsx(Route, { path: "/blog/:slug/edit", element: _jsx(BlogEditor, {}) })] }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }));
}
