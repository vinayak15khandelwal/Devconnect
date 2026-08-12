import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Read-only grid of skill pills with endorsement counts. Endorsing someone
// else's skill (which requires a connection) is wired up on Day 10.
export default function SkillsGrid({ skills }) {
    if (skills.length === 0) {
        return _jsx("p", { className: "text-sm text-gray-400", children: "No skills added yet." });
    }
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: skills.map((skill) => (_jsxs("div", { className: "flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full", children: [skill.name, skill.endorsementCount > 0 && (_jsx("span", { className: "bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: skill.endorsementCount }))] }, skill.id))) }));
}
