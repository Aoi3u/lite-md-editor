"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";

const DynamicKaTeX = dynamic(() => import("./DynamicKaTeX"), {
    ssr: false,

    loading: () => <span className="text-gray-400">Loading math...</span>,
});

const DynamicMermaid = dynamic(() => import("./DynamicMermaid"), {
    ssr: false,

    loading: () => <div className="text-gray-400">Loading diagram...</div>,
});

interface MarkdownPreviewProps {
    html: string;

    previewStyle: "github" | "default";
}

export default function MarkdownPreview({
    html,

    previewStyle,
}: MarkdownPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const rootsRef = useRef<
        Array<ReturnType<typeof import("react-dom/client").createRoot>>
    >([]);

    const { theme } = useTheme();

    useEffect(() => {
        if (!containerRef.current) return;

        if (rootsRef.current.length) {
            rootsRef.current.forEach((root) => {
                try {
                    root.unmount();
                } catch {
                    // ignore errors during unmount
                }
            });

            rootsRef.current = [];
        }

        const container = containerRef.current;

        const tempDiv = document.createElement("div");

        tempDiv.innerHTML = html;

        const codeElements = tempDiv.querySelectorAll("code");

        codeElements.forEach((code) => {
            const parent = code.parentElement;

            const text = code.textContent || "";

            if (parent?.tagName === "PRE") {
                if (parent.querySelector("code.language-mermaid")) {
                    const chart = text.trim();

                    const div = document.createElement("div");

                    div.setAttribute("data-mermaid", chart);

                    parent.replaceWith(div);
                } else if (
                    text.trim().startsWith("$$") &&
                    text.trim().endsWith("$$")
                ) {
                    const math = text.trim().slice(2, -2).trim();

                    const div = document.createElement("div");

                    div.setAttribute("data-math", math);

                    div.setAttribute("data-display", "true");

                    parent.replaceWith(div);
                }
            } else {
                const trimmed = text.trim();

                if (
                    trimmed.startsWith("$") &&
                    trimmed.endsWith("$") &&
                    trimmed.length > 2 &&
                    !trimmed.startsWith("$$")
                ) {
                    const math = trimmed.slice(1, -1);

                    const span = document.createElement("span");

                    span.setAttribute("data-math", math);

                    span.setAttribute("data-display", "false");

                    code.replaceWith(span);
                }
            }
        });

        container.innerHTML = tempDiv.innerHTML;
    }, [html, theme]);

    useEffect(() => {
        if (!containerRef.current) return;

        if (rootsRef.current.length) {
            const toUnmount = rootsRef.current.slice();

            rootsRef.current = [];

            requestAnimationFrame(() => {
                toUnmount.forEach((root) => {
                    try {
                        root.unmount();
                    } catch {
                        // swallow errors during async unmount
                        // console.error('Error unmounting root');
                    }
                });
            });
        }

        const mathElements =
            containerRef.current.querySelectorAll("[data-math]");

        mathElements.forEach((el) => {
            const math = el.getAttribute("data-math") || "";

            const displayMode = el.getAttribute("data-display") === "true";

            const root = document.createElement("span");

            el.replaceWith(root);

            import("react-dom/client").then(({ createRoot }) => {
                const reactRoot = createRoot(root);

                rootsRef.current.push(reactRoot);

                reactRoot.render(
                    <DynamicKaTeX math={math} displayMode={displayMode} />
                );
            });
        });

        const mermaidElements =
            containerRef.current.querySelectorAll("[data-mermaid]");

        mermaidElements.forEach((el) => {
            const chart = el.getAttribute("data-mermaid") || "";

            const root = document.createElement("div");

            el.replaceWith(root);

            import("react-dom/client").then(({ createRoot }) => {
                const reactRoot = createRoot(root);

                rootsRef.current.push(reactRoot);

                reactRoot.render(
                    <DynamicMermaid chart={chart} theme={theme} />
                );
            });
        });

        return () => {
            if (rootsRef.current.length) {
                const toUnmount = rootsRef.current.slice();

                rootsRef.current = [];

                requestAnimationFrame(() => {
                    toUnmount.forEach((root) => {
                        try {
                            root.unmount();
                        } catch {
                            // console.error('Error unmounting root during cleanup');
                        }
                    });
                });
            }
        };
    }, [html, theme]);

    return (
        <div
            ref={containerRef}
            className={`prose-sm max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-900 dark:prose-p:text-gray-300 prose-li:text-gray-900 dark:prose-li:text-gray-300 prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 dark:prose-invert prose-p:leading-tight prose-li:leading-tight ${
                previewStyle === "github" ? "prose-github" : ""
            }`}
        />
    );
}
