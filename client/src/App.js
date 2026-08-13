import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/u/:username", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/blog", element: _jsx(BlogList, {}) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(BlogPost, {}) }), _jsx(Route, { path: "/search", element: _jsx(Search, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/blog/new", element: _jsx(BlogEditor, {}) }), _jsx(Route, { path: "/blog/:slug/edit", element: _jsx(BlogEditor, {}) })] }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }));
}
