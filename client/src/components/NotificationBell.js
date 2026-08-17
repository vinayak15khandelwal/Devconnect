import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
export default function NotificationBell() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const { data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => (await api.get("/api/notifications")).data.data,
        enabled: !!user,
    });
    // AuthContext connects the socket synchronously before `user` updates
    // (on login/register/session-restore), so by the time this effect runs
    // with a truthy `user`, getSocket() is guaranteed to return the live
    // connection rather than null.
    useEffect(() => {
        if (!user)
            return;
        const socket = getSocket();
        if (!socket)
            return;
        function handleNotification() {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
        socket.on("notification", handleNotification);
        return () => {
            socket.off("notification", handleNotification);
        };
    }, [user, queryClient]);
    // Close the dropdown on an outside click.
    useEffect(() => {
        function handleClick(e) {
            if (containerRef.current && !containerRef.current.contains(e.target))
                setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    const markRead = useMutation({
        mutationFn: (id) => api.patch(`/api/notifications/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });
    if (!user)
        return null;
    const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
    return (_jsxs("div", { className: "relative", ref: containerRef, children: [_jsxs("button", { onClick: () => setOpen((v) => !v), "aria-label": "Notifications", className: "relative w-11 h-11 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), _jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })] }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center", children: unreadCount > 9 ? "9+" : unreadCount }))] }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-30", children: [_jsx("div", { className: "px-4 py-2 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Notifications" }), (!notifications || notifications.length === 0) && (_jsx("p", { className: "px-4 py-6 text-sm text-gray-400 dark:text-gray-500 text-center", children: "No notifications yet." })), notifications?.map((n) => (_jsxs("div", { onClick: () => !n.read && markRead.mutate(n.id), className: "px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 flex items-start gap-3 cursor-pointer " +
                            (n.read ? "" : "bg-brand-50/50 dark:bg-brand-900/10"), children: [_jsx("img", { src: n.fromUser?.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${n.fromUser?.name || "?"}`, alt: "", className: "w-8 h-8 rounded-full object-cover bg-gray-100 shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: [n.fromUser ? (_jsx(Link, { to: `/u/${n.fromUser.username}`, className: "font-medium hover:text-brand-600 dark:hover:text-brand-400", children: n.fromUser.name })) : (_jsx("span", { className: "font-medium", children: "Someone" })), " ", n.message] }), _jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5", children: new Date(n.createdAt).toLocaleString() })] }), !n.read && _jsx("span", { className: "w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" })] }, n.id)))] }))] }));
}
