"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";

const DynamicKaTeX = dynamic(() => import("./DynamicKaTeX"), {
    ssr: false,
    loading: () => (
        <span className="text-muted-foreground text-sm italic">
            Loading math...
        </span>
    ),
});

const DynamicMermaid = dynamic(() => import("./DynamicMermaid"), {
    ssr: false,
    loading: () => (
        <div className="text-muted-foreground text-sm italic">
            Loading diagram...
        </div>
    ),
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
                    // ignore
                }
            });
            rootsRef.current = [];
        }

        const container = containerRef.current;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const processNode = (node: Element) => {
            if (node.tagName === "CODE") {
                const parent = node.parentElement;
                const text = node.textContent || "";
                const trimmed = text.trim();

                if (parent?.tagName === "PRE") {
                    const codeLangMatch =
                        node.className.match(/language-(\S+)/);
                    const lang = codeLangMatch ? codeLangMatch[1] : "";

                    if (lang === "mermaid" && trimmed) {
                        const div = document.createElement("div");
                        div.setAttribute("data-mermaid", trimmed);
                        parent.replaceWith(div);
                        return div;
                    } else if (
                        trimmed.startsWith("$$") &&
                        trimmed.endsWith("$$") &&
                        trimmed.length > 4
                    ) {
                        const math = trimmed.slice(2, -2).trim();
                        const div = document.createElement("div");
                        div.setAttribute("data-math", math);
                        div.setAttribute("data-display", "true");
                        parent.replaceWith(div);
                        return div;
                    }
                } else if (
                    trimmed.startsWith("$") &&
                    trimmed.endsWith("$") &&
                    trimmed.length > 2 &&
                    !trimmed.startsWith("$$")
                ) {
                    if (trimmed !== "$" && trimmed !== "$$") {
                        const math = trimmed.slice(1, -1);
                        const span = document.createElement("span");
                        span.setAttribute("data-math", math);
                        span.setAttribute("data-display", "false");
                        node.replaceWith(span);
                        return span;
                    }
                }
            }
            Array.from(node.children).forEach((child) =>
                processNode(child as Element)
            );
            return node;
        };

        Array.from(tempDiv.children).forEach((child) =>
            processNode(child as Element)
        );

        container.innerHTML = tempDiv.innerHTML;
    }, [html]);

    useEffect(() => {
        if (!containerRef.current) return;

        const currentContainer = containerRef.current;

        if (rootsRef.current.length) {
            const toUnmount = rootsRef.current.slice();
            rootsRef.current = [];
            requestAnimationFrame(() => {
                toUnmount.forEach((root) => {
                    try {
                        root.unmount();
                    } catch {
                        // ignore
                    }
                });
            });
        }

        const newRoots: Array<
            ReturnType<typeof import("react-dom/client").createRoot>
        > = [];

        const mathElements = currentContainer.querySelectorAll("[data-math]");
        mathElements.forEach((el) => {
            const math = el.getAttribute("data-math") || "";
            const displayMode = el.getAttribute("data-display") === "true";
            const rootEl = document.createElement(displayMode ? "div" : "span");
            el.replaceWith(rootEl);

            import("react-dom/client").then(({ createRoot }) => {
                const reactRoot = createRoot(rootEl);
                newRoots.push(reactRoot);
                reactRoot.render(
                    <DynamicKaTeX math={math} displayMode={displayMode} />
                );
            });
        });

        const mermaidElements =
            currentContainer.querySelectorAll("[data-mermaid]");
        mermaidElements.forEach((el) => {
            const chart = el.getAttribute("data-mermaid") || "";
            const rootEl = document.createElement("div");
            rootEl.className =
                "mermaid-chart-container my-4 flex justify-center"; // Center diagram
            el.replaceWith(rootEl);

            import("react-dom/client").then(({ createRoot }) => {
                const reactRoot = createRoot(rootEl);
                newRoots.push(reactRoot);
                reactRoot.render(
                    <DynamicMermaid chart={chart} theme={theme} />
                );
            });
        });

        rootsRef.current = newRoots;

        return () => {
            if (rootsRef.current.length) {
                const toUnmount = rootsRef.current.slice();
                rootsRef.current = [];
                requestAnimationFrame(() => {
                    toUnmount.forEach((root) => {
                        try {
                            root.unmount();
                        } catch {
                            // ignore
                        }
                    });
                });
            }
        };
    }, [html, theme]);

    return (
        <div
            ref={containerRef}
            className={`
                preview-content prose prose-sm max-w-none dark:prose-invert
                ${previewStyle === "github" ? "prose-github" : ""}
                text-slate-800 dark:text-slate-200
                [--tw-prose-body:#0f172a] dark:[--tw-prose-body:#e5e7eb]
                prose-pre:bg-secondary prose-code:text-accent-foreground prose-code:font-mono prose-code:text-sm
                prose-headings:font-semibold
                prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
            `}
        />
    );
}
