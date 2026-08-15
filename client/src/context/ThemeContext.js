import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const STORAGE_KEY = "devconnect_theme";
const ThemeContext = createContext(undefined);
function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark")
        return saved;
    // No saved preference — fall back to the OS-level setting.
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function ThemeProvider({ children }) {
    // index.html already applied the class before mount (avoids a flash);
    // this just brings React's state in sync with that same logic.
    const [theme, setTheme] = useState(getInitialTheme);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);
    function toggleTheme() {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    }
    return _jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children });
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
