"use client";

import React from "react";
import MarkdownPreview from "./MarkdownPreview";
import { useTheme } from "@/contexts/ThemeContext";

interface PreviewPaneProps {
    html: string;
    previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PreviewPane({ html, previewRef }: PreviewPaneProps) {
    const { theme, previewStyle } = useTheme();

    return (
        <div
            ref={previewRef as any}
            className="w-1/2 bg-white dark:bg-gray-900 h-full overflow-auto p-6"
            style={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
            }}
        >
            <MarkdownPreview html={html} previewStyle={previewStyle} />
        </div>
    );
}

