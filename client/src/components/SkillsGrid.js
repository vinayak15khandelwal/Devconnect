import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
// Skills arrive pre-sorted by endorsementCount (highest first) from the API,
// so the leader is naturally the profile's "top skill" — flagged with a badge
// rather than building a separate leaderboard for a single-profile view.
export default function SkillsGrid({ skills, username, canEndorse, }) {
    const queryClient = useQueryClient();
    const endorse = useMutation({
        mutationFn: (skillName) => api.post(`/api/endorsements/${username}/${encodeURIComponent(skillName)}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", username] }),
    });
    if (skills.length === 0) {
        return _jsx("p", { className: "text-sm text-gray-400 dark:text-gray-500", children: "No skills added yet." });
    }
    const topCount = skills[0]?.endorsementCount ?? 0;
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: skills.map((skill, i) => (_jsxs("div", { className: "flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-medium px-3 py-1.5 rounded-full", children: [i === 0 && topCount > 0 && _jsx("span", { title: "Most-endorsed skill", children: "\uD83C\uDFC6" }), skill.name, skill.endorsementCount > 0 && (_jsx("span", { className: "bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: skill.endorsementCount })), canEndorse && !skill.endorsedByMe && (_jsx("button", { onClick: () => endorse.mutate(skill.name), disabled: endorse.isPending, title: "Endorse this skill", className: "text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:opacity-50 font-bold", children: "+" })), canEndorse && skill.endorsedByMe && _jsx("span", { className: "text-brand-400", title: "You endorsed this", children: "\u2713" })] }, skill.id))) }));
}
