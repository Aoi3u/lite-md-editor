"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Toolbar() {
    const { theme, previewStyle, toggleTheme, setPreviewStyle } = useTheme();

    return (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    ☀️
                </span>
                <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    style={{
                        backgroundColor:
                            theme === "dark" ? "#3b82f6" : "#d1d5db",
                    }}
                    aria-label="Toggle theme"
                >
                    <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        style={{
                            transform:
                                theme === "dark"
                                    ? "translateX(1.5rem)"
                                    : "translateX(0.25rem)",
                        }}
                    />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    🌙
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Preview:
                </span>
                <select
                    value={previewStyle}
                    onChange={(e) =>
                        setPreviewStyle(e.target.value as "github" | "default")
                    }
                    className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100"
                >
                    <option value="github">GitHub</option>
                    <option value="default">Default</option>
                </select>
            </div>
        </div>
    );
}
