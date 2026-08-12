import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
export default function BlogPost() {
    const { slug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: post, isLoading, error } = useQuery({
        queryKey: ["blog-post", slug],
        queryFn: async () => (await api.get(`/api/blog/${slug}`)).data.data,
        enabled: !!slug,
    });
    const deletePost = useMutation({
        mutationFn: () => api.delete(`/api/blog/${post.id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog"] });
            navigate("/blog");
        },
    });
    if (isLoading)
        return _jsx("div", { className: "min-h-screen flex items-center justify-center text-gray-400", children: "Loading..." });
    if (error || !post)
        return _jsx("div", { className: "min-h-screen flex items-center justify-center text-gray-400", children: "Post not found." });
    const isAuthor = user?.id === post.authorId;
    return (_jsx("div", { className: "min-h-screen bg-gray-50 px-6 py-10", children: _jsxs("article", { className: "max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8", children: [_jsx(Link, { to: "/blog", className: "text-sm text-brand-600 hover:underline", children: "\u2190 All posts" }), _jsxs("div", { className: "flex items-start justify-between mt-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: post.title }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-sm text-gray-400", children: [_jsx(Link, { to: `/u/${post.author?.username}`, className: "hover:text-brand-600", children: post.author?.name }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })] })] }), isAuthor && (_jsxs("div", { className: "flex gap-3 text-sm shrink-0", children: [_jsx(Link, { to: `/blog/${post.slug}/edit`, className: "text-brand-600 hover:underline", children: "Edit" }), _jsx("button", { onClick: () => confirm("Delete this post?") && deletePost.mutate(), className: "text-red-500 hover:underline", children: "Delete" })] }))] }), _jsx("div", { className: "markdown-body mt-6", children: _jsx(ReactMarkdown, { children: post.contentMd }) })] }) }));
}
