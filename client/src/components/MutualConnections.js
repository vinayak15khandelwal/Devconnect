import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
export default function MutualConnections({ username }) {
    const { data } = useQuery({
        queryKey: ["mutual-connections", username],
        queryFn: async () => (await api.get(`/api/connections/mutual/${username}`)).data.data,
    });
    if (!data || data.length === 0)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-2 mt-3 text-sm text-gray-400 dark:text-gray-500", children: [_jsx("div", { className: "flex -space-x-2", children: data.slice(0, 3).map((u) => (_jsx("img", { src: u.avatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${u.name}`, alt: u.name, title: u.name, className: "w-6 h-6 rounded-full object-cover bg-gray-100 dark:bg-gray-700 border-2 border-white" }, u.id))) }), _jsxs("span", { children: [data.length, " mutual connection", data.length !== 1 ? "s" : "", data[0] && (_jsxs(_Fragment, { children: [" ", "\u2014 including", " ", _jsx(Link, { to: `/u/${data[0].username}`, className: "text-brand-600 dark:text-brand-400 hover:underline", children: data[0].name })] }))] })] }));
}
