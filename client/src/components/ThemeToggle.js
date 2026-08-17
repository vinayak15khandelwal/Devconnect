import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from "../context/ThemeContext";
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (_jsx("button", { onClick: toggleTheme, "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode", title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode", className: "w-11 h-11 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition", children: theme === "dark" ? (
        // sun icon (click to go light)
        _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }), _jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }), _jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }), _jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }), _jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }), _jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }), _jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }), _jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })] })) : (
        // moon icon (click to go dark)
        _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" }) })) }));
}
