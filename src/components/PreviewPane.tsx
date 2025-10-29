"use client";

import React from "react";
import MarkdownPreview from "./MarkdownPreview";

interface PreviewPaneProps {
    html: string;
    previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PreviewPane({ html, previewRef }: PreviewPaneProps) {
    return (
        <div
            ref={previewRef}
            className="h-full overflow-auto p-6"
            id="preview-pane"
        >
            <MarkdownPreview html={html} />
        </div>
    );
}
