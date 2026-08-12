import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
export default function BlogList() {
    const { user } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ["blog", 1],
        queryFn: async () => (await api.get("/api/blog?page=1")).data.data,
    });
    return (_jsx("div", { className: "min-h-screen bg-gray-50 px-6 py-10", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700", children: "Blog" }), user && (_jsx(Link, { to: "/blog/new", className: "text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md px-3 py-1.5", children: "Write a post" }))] }), isLoading && _jsx("p", { className: "text-gray-400 text-sm", children: "Loading..." }), data && data.posts.length === 0 && (_jsx("p", { className: "text-gray-400 text-sm", children: "No posts yet \u2014 be the first to write one." })), _jsx("div", { className: "space-y-4", children: data?.posts.map((post) => (_jsxs(Link, { to: `/blog/${post.slug}`, className: "block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition", children: [_jsx("h2", { className: "font-semibold text-gray-900", children: post.title }), _jsx("p", { className: "text-sm text-gray-500 mt-1 line-clamp-2", children: post.excerpt }), _jsxs("div", { className: "flex items-center gap-2 mt-3 text-xs text-gray-400", children: [_jsx("span", { children: post.author?.name }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })] })] }, post.id))) })] }) }));
}
