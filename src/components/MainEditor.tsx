"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import MarkdownIt from "markdown-it";
import MarkdownPreview from "./MarkdownPreview";
import { useTheme } from "@/contexts/ThemeContext";
import Toolbar from "./Toolbar";

export default function MainEditor() {
    const [value, setValue] = useState(`# Hello Markdown

Start editing...

## Math Example

Inline math: \`$E = mc^2$\`

Block math:

\`\`\`
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
\`\`\`

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`
`);
    const [sanitizedHTML, setSanitizedHTML] = useState("");
    const { theme, previewStyle } = useTheme();
    const editorViewRef = useRef<EditorView | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const syncLockRef = useRef<"editor" | "preview" | null>(null);

    const md = useMemo(() => {
        return new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
        });
    }, []);

    useEffect(() => {
        const sanitize = async () => {
            const rawHTML = md.render(value);
            if (typeof window !== "undefined") {
                const DOMPurify = (await import("dompurify")).default;
                setSanitizedHTML(DOMPurify.sanitize(rawHTML));
            }
        };
        sanitize();
    }, [value, md]);

    const scrollExtension = useMemo(() => {
        return EditorView.domEventHandlers({
            scroll: (event, view) => {
                if (syncLockRef.current === "preview") return;

                syncLockRef.current = "editor";

                const previewDiv = previewRef.current;
                if (!previewDiv) {
                    syncLockRef.current = null;
                    return;
                }

                const scroller = view.scrollDOM;
                const editorScrollHeight =
                    scroller.scrollHeight - scroller.clientHeight;
                const previewScrollHeight =
                    previewDiv.scrollHeight - previewDiv.clientHeight;

                if (editorScrollHeight > 0 && previewScrollHeight > 0) {
                    const ratio = scroller.scrollTop / editorScrollHeight;
                    previewDiv.scrollTop = ratio * previewScrollHeight;
                } else if (scroller.scrollTop === 0) {
                    previewDiv.scrollTop = 0;
                }

                requestAnimationFrame(() => {
                    syncLockRef.current = null;
                });
            },
        });
    }, []);

    useEffect(() => {
        const previewDiv = previewRef.current;
        if (!previewDiv) return;

        const handlePreviewScroll = () => {
            if (syncLockRef.current === "editor") return;

            syncLockRef.current = "preview";

            const view = editorViewRef.current;
            if (!view) {
                syncLockRef.current = null;
                return;
            }

            const scroller = view.scrollDOM;
            const editorScrollHeight =
                scroller.scrollHeight - scroller.clientHeight;
            const previewScrollHeight =
                previewDiv.scrollHeight - previewDiv.clientHeight;

            if (previewScrollHeight > 0 && editorScrollHeight > 0) {
                const ratio = previewDiv.scrollTop / previewScrollHeight;
                scroller.scrollTop = ratio * editorScrollHeight;
            } else if (previewDiv.scrollTop === 0) {
                scroller.scrollTop = 0;
            }

            requestAnimationFrame(() => {
                syncLockRef.current = null;
            });
        };

        previewDiv.addEventListener("scroll", handlePreviewScroll);

        return () => {
            previewDiv.removeEventListener("scroll", handlePreviewScroll);
        };
    }, []);

    const handleExport = (fileName?: string) => {
        try {
            const blob = new Blob([value], {
                type: "text/markdown;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            let fname = (fileName || "document").trim();
            if (!fname) fname = "document";
            if (!fname.toLowerCase().endsWith(".md")) {
                fname = `${fname}.md`;
            }

            a.download = fname;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // ignore
        }
    };

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Toolbar onExport={handleExport} />
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 h-full overflow-hidden">
                    <CodeMirror
                        value={value}
                        height="100%"
                        extensions={[markdown(), scrollExtension]}
                        onChange={(val) => setValue(val)}
                        onCreateEditor={(view) => {
                            editorViewRef.current = view;
                        }}
                        theme={theme === "dark" ? githubDark : githubLight}
                        className="h-full"
                    />
                </div>

                <div
                    ref={previewRef}
                    className="w-1/2 bg-white dark:bg-gray-900 h-full overflow-auto p-6"
                    style={{
                        backgroundColor:
                            theme === "dark" ? "#111827" : "#ffffff",
                    }}
                >
                    <MarkdownPreview
                        html={sanitizedHTML}
                        previewStyle={previewStyle}
                    />
                </div>
            </div>
        </div>
    );
}
