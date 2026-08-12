import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api";
// Handles both /blog/new and /blog/:slug/edit — same form either way.
export default function BlogEditor() {
    const { slug } = useParams();
    const isEditing = !!slug;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [contentMd, setContentMd] = useState("");
    const [preview, setPreview] = useState(false);
    const [error, setError] = useState(null);
    const { data: existing } = useQuery({
        queryKey: ["blog-post", slug],
        queryFn: async () => (await api.get(`/api/blog/${slug}`)).data.data,
        enabled: isEditing,
    });
    useEffect(() => {
        if (existing) {
            setTitle(existing.title);
            setContentMd(existing.contentMd);
        }
    }, [existing]);
    const savePost = useMutation({
        mutationFn: () => isEditing
            ? api.patch(`/api/blog/${existing.id}`, { title, contentMd })
            : api.post("/api/blog", { title, contentMd }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["blog"] });
            const savedSlug = res.data.data.slug;
            queryClient.invalidateQueries({ queryKey: ["blog-post", savedSlug] });
            navigate(`/blog/${savedSlug}`);
        },
        onError: (err) => setError(err?.response?.data?.message || "Couldn't save the post."),
    });
    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        savePost.mutate();
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 px-6 py-10", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700 mb-6", children: isEditing ? "Edit post" : "Write a post" }), error && (_jsx("div", { className: "mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Post title", className: "w-full rounded-md border border-gray-300 px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Content (Markdown supported)" }), _jsx("button", { type: "button", onClick: () => setPreview((v) => !v), className: "text-sm text-brand-600 hover:underline", children: preview ? "Back to editing" : "Preview" })] }), preview ? (_jsx("div", { className: "markdown-body border border-gray-200 rounded-md p-4 min-h-[240px]", children: _jsx(ReactMarkdown, { children: contentMd || "*Nothing to preview yet.*" }) })) : (_jsx("textarea", { required: true, minLength: 20, rows: 12, value: contentMd, onChange: (e) => setContentMd(e.target.value), placeholder: "# Write in Markdown\n\nHeadings, **bold**, `code`, lists, links \u2014 all supported.", className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500" })), _jsx("button", { type: "submit", disabled: savePost.isPending, className: "bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2", children: savePost.isPending ? "Saving..." : isEditing ? "Save changes" : "Publish post" })] })] }) }));
}
