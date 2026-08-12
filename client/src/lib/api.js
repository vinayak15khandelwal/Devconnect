import axios from "axios";
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    withCredentials: true, // send the httpOnly auth cookie
});
// Also attach a bearer token from localStorage as a fallback, useful
// right after GitHub OAuth redirects where we pass ?token=... once.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("devconnect_token");
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
