"use client";

import React, { useEffect, useRef } from "react";

interface DynamicMermaidProps {
    chart: string;
    theme: "light" | "dark";
}

export default function DynamicMermaid({ chart, theme }: DynamicMermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!containerRef.current) return;

            const mermaid = (await import("mermaid")).default;

            const mermaidTheme = theme === "dark" ? "dark" : "default";

            mermaid.initialize({
                startOnLoad: false,
                theme: mermaidTheme,
            });

            try {
                const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
                const { svg } = await mermaid.render(id, chart);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (error) {
                console.error("Mermaid rendering error:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<pre>${chart}</pre>`;
                }
            }
        };

        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }
        renderChart();
    }, [chart, theme]);

    return <div ref={containerRef} className="mermaid-container" />;
}
