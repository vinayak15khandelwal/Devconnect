import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ConnectButton from "../components/ConnectButton";
export default function Dashboard() {
    const { user } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => (await api.get("/api/dashboard")).data.data,
    });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-8", children: [_jsxs("p", { className: "text-gray-700 dark:text-gray-300 mb-6", children: ["Welcome back, ", _jsx("span", { className: "font-semibold", children: user?.name }), "."] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 mb-8", children: [_jsx(StatCard, { label: "Projects", value: data?.stats.projects }), _jsx(StatCard, { label: "Posts", value: data?.stats.posts }), _jsx(StatCard, { label: "Connections", value: data?.stats.connections })] }), isLoading && _jsx("p", { className: "text-gray-400 dark:text-gray-500 text-sm", children: "Loading..." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "md:col-span-2 space-y-8", children: [_jsxs("section", { children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Activity from your connections" }), data && data.feed.length === 0 && (_jsxs(EmptyCard, { children: ["Connect with other developers to see their posts here.", " ", _jsx(Link, { to: "/search", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "Find developers" })] })), _jsx("div", { className: "space-y-3", children: data?.feed.map((post) => (_jsx(PostRow, { post: post }, post.id))) })] }), _jsxs("section", { children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Trending on DevConnect" }), data && data.trending.length === 0 && _jsx(EmptyCard, { children: "Nothing trending yet \u2014 be the first to post." }), _jsx("div", { className: "space-y-3", children: data?.trending.map((post) => (_jsx(PostRow, { post: post }, post.id))) })] })] }), _jsxs("aside", { children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "People you may know" }), data && data.suggestions.length === 0 && _jsx(EmptyCard, { children: "No suggestions right now." }), _jsx("div", { className: "space-y-3", children: data?.suggestions.map((s) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4", children: [_jsxs(Link, { to: `/u/${s.username}`, className: "flex items-center gap-3 min-w-0", children: [_jsx("img", { src: s.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${s.name}`, alt: s.name, className: "w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700 shrink-0" }), _jsx("span", { className: "text-sm font-medium text-gray-800 dark:text-gray-100 truncate", children: s.name })] }), _jsx("div", { className: "mt-3", children: _jsx(ConnectButton, { username: s.username }) })] }, s.id))) })] })] })] })] }));
}
function StatCard({ label, value }) {
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center", children: [_jsx("p", { className: "text-2xl font-bold text-brand-700 dark:text-brand-400", children: value ?? "—" }), _jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5", children: label })] }));
}
function EmptyCard({ children }) {
    return (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-sm text-gray-400 dark:text-gray-500", children: children }));
}
function PostRow({ post }) {
    return (_jsxs(Link, { to: `/blog/${post.slug}`, className: "block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition", children: [_jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100 truncate", children: post.title }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1", children: post.excerpt }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500", children: [_jsx("span", { children: post.author?.name }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })] })] }));
}
