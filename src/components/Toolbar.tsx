"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ToolbarProps = {
    onExport?: (fileName?: string) => void;
};

export default function Toolbar({ onExport }: ToolbarProps) {
    const { theme, previewStyle, toggleTheme, setPreviewStyle } = useTheme();
    const [exportName, setExportName] = useState<string>("document");

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        LiteMD
                    </span>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex items-center justify-center h-8 w-8 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                    <div
                        className="inline-flex rounded-md bg-transparent p-1"
                        role="tablist"
                        aria-label="Preview style"
                    >
                        <button
                            role="tab"
                            aria-selected={previewStyle === "github"}
                            onClick={() => setPreviewStyle("github")}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                previewStyle === "github"
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            GitHub
                        </button>
                        <button
                            role="tab"
                            aria-selected={previewStyle === "default"}
                            onClick={() => setPreviewStyle("default")}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                previewStyle === "default"
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            Default
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="export-name" className="sr-only">
                    Export filename
                </label>
                <input
                    id="export-name"
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                    className="hidden sm:inline-block w-48 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="document"
                />

                <button
                    onClick={() => onExport?.(exportName)}
                    title="Export markdown"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-b from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="text-sm font-medium">Export</span>
                </button>
            </div>
        </div>
    );
}
