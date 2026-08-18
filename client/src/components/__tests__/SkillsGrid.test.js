import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import SkillsGrid from "../SkillsGrid";
function renderWithProviders(ui) {
    const queryClient = new QueryClient();
    return render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(MemoryRouter, { children: ui }) }));
}
describe("SkillsGrid", () => {
    it("shows an empty state when there are no skills", () => {
        renderWithProviders(_jsx(SkillsGrid, { skills: [], username: "alice", canEndorse: false }));
        expect(screen.getByText(/no skills added yet/i)).toBeInTheDocument();
    });
    it("renders each skill name and its endorsement count badge", () => {
        renderWithProviders(_jsx(SkillsGrid, { skills: [
                { id: "1", name: "React", endorsementCount: 3, endorsedByMe: false },
                { id: "2", name: "TypeScript", endorsementCount: 0, endorsedByMe: false },
            ], username: "alice", canEndorse: false }));
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
    it("does not show endorse controls when canEndorse is false", () => {
        renderWithProviders(_jsx(SkillsGrid, { skills: [{ id: "1", name: "React", endorsementCount: 0, endorsedByMe: false }], username: "alice", canEndorse: false }));
        expect(screen.queryByTitle(/endorse this skill/i)).not.toBeInTheDocument();
    });
    it("shows an endorse button for a not-yet-endorsed skill when canEndorse is true", () => {
        renderWithProviders(_jsx(SkillsGrid, { skills: [{ id: "1", name: "React", endorsementCount: 0, endorsedByMe: false }], username: "alice", canEndorse: true }));
        expect(screen.getByTitle(/endorse this skill/i)).toBeInTheDocument();
    });
    it("shows a checkmark instead of an endorse button once already endorsed", () => {
        renderWithProviders(_jsx(SkillsGrid, { skills: [{ id: "1", name: "React", endorsementCount: 1, endorsedByMe: true }], username: "alice", canEndorse: true }));
        expect(screen.queryByTitle(/endorse this skill/i)).not.toBeInTheDocument();
        expect(screen.getByTitle(/you endorsed this/i)).toBeInTheDocument();
    });
});
