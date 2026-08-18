import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "../PasswordInput";
describe("PasswordInput", () => {
    it("renders as a password field by default, hiding the value", () => {
        render(_jsx(PasswordInput, { value: "secret123", onChange: vi.fn() }));
        const input = screen.getByDisplayValue("secret123");
        expect(input).toHaveAttribute("type", "password");
    });
    it("reveals the value as text when the eye button is clicked", async () => {
        const user = userEvent.setup();
        render(_jsx(PasswordInput, { value: "secret123", onChange: vi.fn() }));
        await user.click(screen.getByRole("button", { name: /show password/i }));
        expect(screen.getByDisplayValue("secret123")).toHaveAttribute("type", "text");
    });
    it("hides it again on a second click, and the label flips accordingly", async () => {
        const user = userEvent.setup();
        render(_jsx(PasswordInput, { value: "secret123", onChange: vi.fn() }));
        await user.click(screen.getByRole("button", { name: /show password/i }));
        await user.click(screen.getByRole("button", { name: /hide password/i }));
        expect(screen.getByDisplayValue("secret123")).toHaveAttribute("type", "password");
    });
    it("the toggle button is type=button, so it can't submit a wrapping form", () => {
        render(_jsx(PasswordInput, { value: "", onChange: vi.fn() }));
        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
});
