import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    async function loadMe() {
        try {
            const { data } = await api.get("/api/auth/me");
            setUser(data.data);
            const token = localStorage.getItem("devconnect_token");
            if (token)
                connectSocket(token);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        // Handle the ?token=... that the GitHub OAuth callback redirects with.
        const params = new URLSearchParams(window.location.search);
        const tokenFromRedirect = params.get("token");
        if (tokenFromRedirect) {
            localStorage.setItem("devconnect_token", tokenFromRedirect);
            window.history.replaceState({}, "", window.location.pathname);
        }
        loadMe();
    }, []);
    async function login(email, password) {
        const { data } = await api.post("/api/auth/login", { email, password });
        localStorage.setItem("devconnect_token", data.data.accessToken);
        setUser(data.data.user);
        connectSocket(data.data.accessToken);
        navigate("/dashboard");
    }
    async function register(name, username, email, password) {
        const { data } = await api.post("/api/auth/register", { name, username, email, password });
        localStorage.setItem("devconnect_token", data.data.accessToken);
        setUser(data.data.user);
        connectSocket(data.data.accessToken);
        navigate("/dashboard");
    }
    async function logout() {
        await api.post("/api/auth/logout");
        localStorage.removeItem("devconnect_token");
        disconnectSocket();
        setUser(null);
        navigate("/login");
    }
    function loginWithGithub() {
        window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/github`;
    }
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, register, logout, loginWithGithub }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
