import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import ThemeToggle from "../components/ThemeToggle";
export default function Login() {
    const { login, loginWithGithub } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
        }
        catch (err) {
            setError(err?.response?.data?.message || "Login failed");
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsxs("div", { className: "relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4", children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx(ThemeToggle, {}) }), _jsxs("div", { className: "w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-brand-700 dark:text-brand-400 mb-1", children: "DevConnect" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-6", children: "Log in to your account" }), error && (_jsx("div", { className: "mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-md px-3 py-2", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Password" }), _jsx(PasswordInput, { required: true, value: password, onChange: (e) => setPassword(e.target.value) })] }), _jsx("button", { type: "submit", disabled: submitting, className: "w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md py-2 transition", children: submitting ? "Logging in..." : "Log in" })] }), _jsxs("div", { className: "my-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500", children: [_jsx("div", { className: "h-px bg-gray-200 dark:bg-gray-700 flex-1" }), " OR ", _jsx("div", { className: "h-px bg-gray-200 dark:bg-gray-700 flex-1" })] }), _jsx("button", { onClick: loginWithGithub, className: "w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-md py-2 transition", children: "Continue with GitHub" }), _jsxs("p", { className: "mt-6 text-sm text-gray-500 dark:text-gray-400 text-center", children: ["No account?", " ", _jsx(Link, { to: "/register", className: "text-brand-600 dark:text-brand-400 font-medium hover:underline", children: "Register" })] })] })] }));
}
