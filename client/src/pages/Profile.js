import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SkillsGrid from "../components/SkillsGrid";
import ProjectCard from "../components/ProjectCard";
import ConnectButton from "../components/ConnectButton";
import MutualConnections from "../components/MutualConnections";
import Navbar from "../components/Navbar";
export default function Profile() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);
    const [addingProject, setAddingProject] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const isOwnProfile = currentUser?.username === username;
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile", username],
        queryFn: async () => (await api.get(`/api/profile/${username}`)).data.data,
        enabled: !!username,
    });
    // Shares its query key with ConnectButton, so this doesn't trigger a
    // second network request — just reads the same cached status to decide
    // whether the skills grid should show endorse controls.
    const { data: connectionStatus } = useQuery({
        queryKey: ["connection-status", username],
        queryFn: async () => (await api.get(`/api/connections/status/${username}`)).data.data,
        enabled: !!username && !isOwnProfile,
    });
    const canEndorse = connectionStatus?.status === "ACCEPTED";
    const updateProfile = useMutation({
        mutationFn: (payload) => api.patch("/api/profile", payload),
        onSuccess: () => {
            setMutationError(null);
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
            setEditing(false);
        },
        onError: (err) => setMutationError(err?.response?.data?.message || "Couldn't save profile changes."),
    });
    const uploadAvatar = useMutation({
        mutationFn: (file) => {
            const form = new FormData();
            form.append("avatar", file);
            // IMPORTANT: do not set a Content-Type header here. The browser must
            // generate it itself (multipart/form-data; boundary=...) — forcing
            // "multipart/form-data" with no boundary produces a request the
            // server's multipart parser can't read, and the request fails.
            return api.post("/api/profile/avatar", form);
        },
        onSuccess: () => {
            setMutationError(null);
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
        },
        onError: (err) => setMutationError(err?.response?.data?.message || "Avatar upload failed."),
    });
    const addProject = useMutation({
        mutationFn: (payload) => {
            const form = new FormData();
            form.append("title", payload.title);
            form.append("description", payload.description);
            form.append("techStack", JSON.stringify(payload.techStack));
            // Same fix as avatar upload: let the browser set Content-Type + boundary.
            return api.post("/api/projects", form);
        },
        onSuccess: () => {
            setMutationError(null);
            queryClient.invalidateQueries({ queryKey: ["profile", username] });
            setAddingProject(false);
        },
        onError: (err) => setMutationError(err?.response?.data?.message || "Couldn't create the project."),
    });
    if (isLoading)
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex items-center justify-center text-gray-400 dark:text-gray-500 py-20", children: "Loading..." })] }));
    if (error || !profile)
        return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex items-center justify-center text-gray-400 dark:text-gray-500 py-20", children: "Developer not found." })] }));
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsxs("div", { className: "max-w-3xl mx-auto px-6 py-10 space-y-8", children: [mutationError && (_jsx("div", { className: "text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-md px-3 py-2", children: mutationError })), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-start gap-5", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: profile.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`, alt: profile.name, className: "w-20 h-20 rounded-full object-cover bg-gray-100 dark:bg-gray-700" }), isOwnProfile && (_jsxs("label", { className: "absolute -bottom-1 -right-1 bg-brand-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer", children: ["+", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => e.target.files?.[0] && uploadAvatar.mutate(e.target.files[0]) })] }))] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: profile.name }), _jsxs("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: ["@", profile.username] })] }), isOwnProfile ? (_jsx("button", { onClick: () => setEditing((v) => !v), className: "text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700", children: editing ? "Cancel" : "Edit profile" })) : (_jsx(ConnectButton, { username: profile.username }))] }), !editing ? (_jsxs(_Fragment, { children: [profile.bio && _jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-2", children: profile.bio }), _jsxs("div", { className: "flex gap-4 mt-2 text-sm text-gray-400 dark:text-gray-500", children: [profile.location && _jsxs("span", { children: ["\uD83D\uDCCD ", profile.location] }), profile.githubUrl && (_jsx("a", { href: profile.githubUrl, target: "_blank", rel: "noreferrer", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "GitHub" }))] }), !isOwnProfile && _jsx(MutualConnections, { username: profile.username })] })) : (_jsx(EditForm, { initial: profile, submitting: updateProfile.isPending, onSubmit: (payload) => updateProfile.mutate(payload) }))] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6", children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Skills" }), _jsx(SkillsGrid, { skills: profile.skills, username: profile.username, canEndorse: canEndorse })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100", children: "Projects" }), isOwnProfile && (_jsx("button", { onClick: () => setAddingProject((v) => !v), className: "text-sm text-brand-600 dark:text-brand-400 hover:underline", children: addingProject ? "Cancel" : "+ Add project" }))] }), addingProject && (_jsx(AddProjectForm, { submitting: addProject.isPending, onSubmit: addProject.mutateAsync })), profile.projects.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "No projects yet." })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: profile.projects.map((p) => (_jsx(ProjectCard, { project: p }, p.id))) }))] })] })] }));
}
function EditForm({ initial, submitting, onSubmit, }) {
    const [bio, setBio] = useState(initial.bio || "");
    const [location, setLocation] = useState(initial.location || "");
    const [githubUrl, setGithubUrl] = useState(initial.githubUrl || "");
    const [skillsInput, setSkillsInput] = useState(initial.skills.map((s) => s.name).join(", "));
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            bio, location, githubUrl,
            skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        });
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "mt-3 space-y-3", children: [_jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), maxLength: 280, rows: 2, placeholder: "A short bio", className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("input", { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Location", className: "rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("input", { value: githubUrl, onChange: (e) => setGithubUrl(e.target.value), placeholder: "GitHub URL", className: "rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" })] }), _jsx("input", { value: skillsInput, onChange: (e) => setSkillsInput(e.target.value), placeholder: "Skills, comma separated (e.g. React, Node.js, PostgreSQL)", className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("button", { type: "submit", disabled: submitting, className: "bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2", children: submitting ? "Saving..." : "Save changes" })] }));
}
function AddProjectForm({ submitting, onSubmit, }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await onSubmit({ title, description, techStack: techStack.split(",").map((t) => t.trim()).filter(Boolean) });
            // Only clear the form once the project is confirmed persisted —
            // clearing unconditionally here was what made a failed submission
            // look successful.
            setTitle("");
            setDescription("");
            setTechStack("");
        }
        catch {
            // Error is already surfaced via the mutation's onError -> mutationError banner.
            // Keep the user's input in place so they don't have to retype it.
        }
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "mb-4 space-y-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4", children: [_jsx("input", { required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Project title", className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("textarea", { required: true, value: description, onChange: (e) => setDescription(e.target.value), rows: 2, placeholder: "Short description", className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("input", { required: true, value: techStack, onChange: (e) => setTechStack(e.target.value), placeholder: "Tech stack, comma separated (e.g. React, Express)", className: "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("button", { type: "submit", disabled: submitting, className: "bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-2", children: submitting ? "Adding..." : "Add project" })] }));
}
