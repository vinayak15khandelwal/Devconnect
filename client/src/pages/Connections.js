import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function Connections() {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const { data: pending, isLoading: pendingLoading } = useQuery({
        queryKey: ["connections-pending"],
        queryFn: async () => (await api.get("/api/connections/pending")).data.data,
    });
    const { data: accepted, isLoading: acceptedLoading } = useQuery({
        queryKey: ["connections-accepted"],
        queryFn: async () => (await api.get("/api/connections")).data.data,
    });
    const respond = useMutation({
        mutationFn: ({ id, action }) => api.patch(`/api/connections/${id}/respond`, { action }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["connections-pending"] });
            queryClient.invalidateQueries({ queryKey: ["connections-accepted"] });
        },
    });
    const remove = useMutation({
        mutationFn: (id) => api.delete(`/api/connections/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["connections-accepted"] }),
    });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Navbar, {}), _jsxs("div", { className: "max-w-2xl mx-auto px-6 py-10 space-y-8", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700 dark:text-brand-400", children: "Connections" }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6", children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Pending requests" }), pendingLoading && _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "Loading..." }), pending && pending.length === 0 && _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "No pending requests." }), _jsx("div", { className: "space-y-3", children: pending?.map((c) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: `/u/${c.requester.username}`, className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("img", { src: c.requester.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${c.requester.name}`, alt: c.requester.name, className: "w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700" }), _jsx("span", { className: "text-sm font-medium text-gray-800 dark:text-gray-100 truncate", children: c.requester.name })] }), _jsxs("div", { className: "flex gap-2 text-sm shrink-0", children: [_jsx("button", { onClick: () => respond.mutate({ id: c.id, action: "ACCEPT" }), className: "bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5", children: "Accept" }), _jsx("button", { onClick: () => respond.mutate({ id: c.id, action: "REJECT" }), className: "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-3 py-1.5", children: "Reject" })] })] }, c.id))) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6", children: [_jsx("h2", { className: "font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Your connections" }), acceptedLoading && _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "Loading..." }), accepted && accepted.length === 0 && _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "No connections yet." }), _jsx("div", { className: "space-y-3", children: accepted?.map((c) => {
                                    // The logged-in user could be in either the requester or addressee
                                    // slot on a given row — show whichever side isn't them.
                                    const other = c.requester.id === currentUser?.id ? c.addressee : c.requester;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: `/u/${other.username}`, className: "flex items-center gap-3 min-w-0 flex-1", children: [_jsx("img", { src: other.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${other.name}`, alt: other.name, className: "w-9 h-9 rounded-full object-cover bg-gray-100 dark:bg-gray-700" }), _jsx("span", { className: "text-sm font-medium text-gray-800 dark:text-gray-100 truncate", children: other.name })] }), _jsx("button", { onClick: () => remove.mutate(c.id), className: "text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 shrink-0 px-2 py-1", children: "Remove" })] }, c.id));
                                }) })] })] })] }));
}
