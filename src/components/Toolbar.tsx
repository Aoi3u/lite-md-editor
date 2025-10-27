"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ToolbarProps = {
    onExport?: (fileName?: string) => void;
};

export default function Toolbar({ onExport }: ToolbarProps) {
    const { theme, previewStyle, toggleTheme, setPreviewStyle } = useTheme();
    const [exportName, setExportName] = useState<string>("document");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <button
                    aria-label="Open menu"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        LiteMD
                    </span>
                </div>
            </div>

            {/* Drawer + overlay */}
            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />

                    <aside className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 shadow-lg p-4 overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Menu
                            </h3>
                            <button
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleTheme()}
                                    aria-label="Toggle theme"
                                    className="flex items-center justify-center h-9 w-9 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {theme === "dark" ? (
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                                        </svg>
                                    )}
                                </button>
                                <div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Theme
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {theme}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Preview style
                                </div>
                                <div
                                    className="inline-flex rounded-md bg-transparent p-1"
                                    role="tablist"
                                    aria-label="Preview style"
                                >
                                    <button
                                        role="tab"
                                        aria-selected={
                                            previewStyle === "github"
                                        }
                                        onClick={() =>
                                            setPreviewStyle("github")
                                        }
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                            previewStyle === "github"
                                                ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        GitHub
                                    </button>
                                    <button
                                        role="tab"
                                        aria-selected={
                                            previewStyle === "default"
                                        }
                                        onClick={() =>
                                            setPreviewStyle("default")
                                        }
                                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                            previewStyle === "default"
                                                ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        Default
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="drawer-export-name"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Export filename
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        id="drawer-export-name"
                                        value={exportName}
                                        onChange={(e) =>
                                            setExportName(e.target.value)
                                        }
                                        className="w-full px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="document"
                                    />
                                    <button
                                        onClick={() => {
                                            onExport?.(exportName);
                                            setOpen(false);
                                        }}
                                        title="Export markdown"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-b from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}
