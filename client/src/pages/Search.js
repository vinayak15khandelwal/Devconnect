import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import DeveloperCard from "../components/DeveloperCard";
export default function Search() {
    const [skill, setSkill] = useState("");
    const [location, setLocation] = useState("");
    const [appliedSkill, setAppliedSkill] = useState("");
    const [appliedLocation, setAppliedLocation] = useState("");
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["search", appliedSkill, appliedLocation, page],
        queryFn: async () => {
            const params = new URLSearchParams({ page: String(page) });
            if (appliedSkill)
                params.set("skill", appliedSkill);
            if (appliedLocation)
                params.set("location", appliedLocation);
            return (await api.get(`/api/search?${params.toString()}`)).data.data;
        },
    });
    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        setAppliedSkill(skill);
        setAppliedLocation(location);
    }
    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
    return (_jsx("div", { className: "min-h-screen bg-gray-50 px-6 py-10", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-xl font-bold text-brand-700 mb-6", children: "Find developers" }), _jsxs("form", { onSubmit: handleSearch, className: "flex flex-col sm:flex-row gap-3 mb-8", children: [_jsx("input", { value: skill, onChange: (e) => setSkill(e.target.value), placeholder: "Skill (e.g. React)", className: "flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("input", { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Location (e.g. Delhi)", className: "flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsx("button", { type: "submit", className: "bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-md px-5 py-2", children: "Search" })] }), isLoading && _jsx("p", { className: "text-gray-400 text-sm", children: "Loading..." }), data && data.developers.length === 0 && (_jsx("p", { className: "text-gray-400 text-sm", children: "No developers matched those filters." })), _jsx("div", { className: `grid grid-cols-1 sm:grid-cols-2 gap-4 ${isFetching ? "opacity-60" : ""}`, children: data?.developers.map((dev) => (_jsx(DeveloperCard, { dev: dev }, dev.id))) }), data && data.total > data.pageSize && (_jsxs("div", { className: "flex items-center justify-center gap-4 mt-8 text-sm", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage((p) => p - 1), className: "text-brand-600 disabled:text-gray-300 disabled:cursor-not-allowed", children: "\u2190 Previous" }), _jsxs("span", { className: "text-gray-400", children: ["Page ", page, " of ", totalPages] }), _jsx("button", { disabled: page >= totalPages, onClick: () => setPage((p) => p + 1), className: "text-brand-600 disabled:text-gray-300 disabled:cursor-not-allowed", children: "Next \u2192" })] }))] }) }));
}
