"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, Download, Github, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type ToolbarProps = {
    onExport?: (fileName?: string) => void;
};

export default function Toolbar({ onExport }: ToolbarProps) {
    const { theme, previewStyle, toggleTheme, setPreviewStyle } = useTheme();
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
                    onClick={() =>
                        setPreviewStyle(
                            previewStyle === "github" ? "default" : "github"
                        )
                    }
                    aria-label="Toggle Preview Style"
                    title={`Switch to ${
                        previewStyle === "github" ? "Default" : "GitHub"
                    } style`}
                    className="btn"
                >
                    {previewStyle === "github" ? (
                        <Github size={18} />
                    ) : (
                        <FileText size={18} />
                    )}
                </button>

                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={`Switch to ${
                        theme === "dark" ? "Light" : "Dark"
                    } mode`}
                    className="btn"
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
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
