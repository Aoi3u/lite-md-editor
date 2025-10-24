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
type PreviewStyle = "github" | "default";

interface ThemeContextType {
    theme: Theme;
    previewStyle: PreviewStyle;
    toggleTheme: () => void;
    setPreviewStyle: (style: PreviewStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [theme, setThemeState] = useState<Theme>("light");
    const [previewStyle, setPreviewStyleState] =
        useState<PreviewStyle>("github");

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

        const savedStyle = localStorage.getItem(
            "previewStyle"
        ) as PreviewStyle | null;
        if (savedStyle) {
            setPreviewStyleState(savedStyle);
        }
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

    const setPreviewStyle = (style: PreviewStyle) => {
        setPreviewStyleState(style);
        localStorage.setItem("previewStyle", style);
    };

    return (
        <ThemeContext.Provider
            value={{ theme, previewStyle, toggleTheme, setPreviewStyle }}
        >
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
