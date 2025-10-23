"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import MarkdownIt from "markdown-it";
import MarkdownPreview from "./MarkdownPreview";

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
    const [isDark, setIsDark] = useState(false);
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
        const checkDarkMode = () => {
            const isDarkMode = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            setIsDark(isDarkMode);
        };

        checkDarkMode();

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
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

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="h-full overflow-auto">
                    <CodeMirror
                        value={value}
                        height="100vh"
                        extensions={[markdown(), scrollExtension]}
                        onChange={(val) => setValue(val)}
                        onCreateEditor={(view) => {
                            editorViewRef.current = view;
                        }}
                        theme={isDark ? githubDark : githubLight}
                        className="h-full"
                    />
                </div>
            </div>

            <div
                ref={previewRef}
                className="w-1/2 bg-gray-50 dark:bg-gray-800 h-screen overflow-auto p-6"
            >
                <MarkdownPreview html={sanitizedHTML} />
            </div>
        </div>
    );
}
