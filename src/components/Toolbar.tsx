"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, Download } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type ToolbarProps = {
    onExport?: (fileName?: string) => void;
};

export default function Toolbar({ onExport }: ToolbarProps) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);
    const [exportName, setExportName] = useState<string>("document");
    const [isEditingFilename, setIsEditingFilename] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingFilename && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingFilename]);

    const handleExport = () => {
        onExport?.(exportName);
    };

    const handleFilenameClick = () => {
        setIsEditingFilename(true);
    };

    const handleFilenameBlur = () => {
        setIsEditingFilename(false);
        if (!exportName.trim()) {
            setExportName("untitled");
        }
    };

    const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportName(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleFilenameBlur();
        } else if (e.key === "Escape") {
            setIsEditingFilename(false);
        }
    };

    return (
        <div className="toolbar">
            <div className="flex items-center gap-2">
                <span className="title">LiteMD</span>
            </div>

            <div className="flex-1 flex justify-center items-center px-4 min-w-0">
                {isEditingFilename ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={exportName}
                        onChange={handleFilenameChange}
                        onBlur={handleFilenameBlur}
                        onKeyDown={handleKeyDown}
                        className="px-2 py-1 rounded-md border border-ring bg-input text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring w-48 max-w-full text-center"
                    />
                ) : (
                    <span
                        onClick={handleFilenameClick}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded hover:bg-secondary truncate"
                        title="Click to edit filename"
                    >
                        {exportName || "untitled"}.md
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={
                        mounted
                            ? `Switch to ${
                                  theme === "dark" ? "Light" : "Dark"
                              } mode`
                            : "Toggle theme"
                    }
                    className="btn"
                >
                    {mounted ? (
                        theme === "dark" ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )
                    ) : (
                        <span
                            style={{
                                display: "inline-block",
                                width: 18,
                                height: 18,
                            }}
                        />
                    )}
                </button>

                <button
                    onClick={handleExport}
                    title="Export markdown (.md)"
                    className="btn"
                >
                    <Download size={18} />
                </button>
            </div>
        </div>
    );
}
