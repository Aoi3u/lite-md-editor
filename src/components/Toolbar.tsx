"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Moon, Sun, Download } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { computeCounts, Counts } from "@/utils/counts";

function CountPopover({ data }: { data: Counts }) {
    return (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-[hsl(var(--border))] rounded-md shadow-md p-2 z-50 text-xs">
            <div className="flex justify-between">
                <span>Words</span>
                <span>{data.words}</span>
            </div>
            <div className="flex justify-between">
                <span>Chars (with spaces)</span>
                <span>{data.charsWithSpaces}</span>
            </div>
            <div className="flex justify-between">
                <span>Chars (no spaces)</span>
                <span>{data.charsNoSpaces}</span>
            </div>
            <div className="flex justify-between">
                <span>Chars (no whitespace)</span>
                <span>{data.charsNoWhitespace}</span>
            </div>
            <div className="flex justify-between">
                <span>Chars (no newlines)</span>
                <span>{data.charsNoNewlines}</span>
            </div>
            <div className="flex justify-between">
                <span>Lines</span>
                <span>{data.lines}</span>
            </div>
        </div>
    );
}

type ToolbarProps = {
    onExport?: (fileName?: string) => void;
    value?: string;
};

export default function Toolbar({ onExport, value }: ToolbarProps) {
    const counts: Counts = useMemo(() => computeCounts(value), [value]);
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);
    const [exportName, setExportName] = useState<string>("document");
    const [isEditingFilename, setIsEditingFilename] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showCounts, setShowCounts] = useState(false);
    const countsRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!showCounts) return;
            if (!countsRef.current) return;
            if (!e.target) return;
            if (!(e.target instanceof Node)) return;
            if (!countsRef.current.contains(e.target)) setShowCounts(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [showCounts]);

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
                <div
                    ref={countsRef}
                    className="text-sm text-muted-foreground mr-2 cursor-pointer select-none relative"
                >
                    <div onClick={() => setShowCounts((s) => !s)}>
                        Words: {counts.words} · Chars: {counts.charsWithSpaces}
                    </div>
                    {showCounts && <CountPopover data={counts} />}
                </div>
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
