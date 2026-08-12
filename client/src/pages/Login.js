import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: _jsxs("div", { className: "w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-brand-700 mb-1", children: "DevConnect" }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "Log in to your account" }), error && (_jsx("div", { className: "mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsx("button", { type: "submit", disabled: submitting, className: "w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md py-2 transition", children: submitting ? "Logging in..." : "Log in" })] }), _jsxs("div", { className: "my-4 flex items-center gap-3 text-xs text-gray-400", children: [_jsx("div", { className: "h-px bg-gray-200 flex-1" }), " OR ", _jsx("div", { className: "h-px bg-gray-200 flex-1" })] }), _jsx("button", { onClick: loginWithGithub, className: "w-full border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-md py-2 transition", children: "Continue with GitHub" }), _jsxs("p", { className: "mt-6 text-sm text-gray-500 text-center", children: ["No account?", " ", _jsx(Link, { to: "/register", className: "text-brand-600 font-medium hover:underline", children: "Register" })] })] }) }));
}
