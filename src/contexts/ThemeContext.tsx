/* eslint-disable */
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useLayoutEffect,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [theme, setThemeState] = useState<Theme>("light");

    useLayoutEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!mounted) return;

        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";
            setThemeState(systemTheme);
        }

        // No preview style persistence anymore
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        applyThemeToDOM(theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setThemeState(newTheme);
        applyThemeToDOM(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Helper function to apply theme to DOM
    const applyThemeToDOM = (t: Theme) => {
        const html = document.documentElement;
        if (t === "dark") {
            html.setAttribute("class", "dark");
        } else {
            html.setAttribute("class", "");
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
