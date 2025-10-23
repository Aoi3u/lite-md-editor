"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

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
}

export default function MarkdownPreview({ html }: MarkdownPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rootsRef = useRef<
        Array<ReturnType<typeof import("react-dom/client").createRoot>>
    >([]);

    useEffect(() => {
        if (!containerRef.current) return;

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
    }, [html]);

    useEffect(() => {
        if (!containerRef.current) return;

        rootsRef.current.forEach((root) => {
            root.unmount();
        });
        rootsRef.current = [];

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
                reactRoot.render(<DynamicMermaid chart={chart} />);
            });
        });

        return () => {
            rootsRef.current.forEach((root) => {
                root.unmount();
            });
            rootsRef.current = [];
        };
    }, [html]);

    return (
        <div
            ref={containerRef}
            className="prose prose-slate dark:prose-invert max-w-none"
        />
    );
}
