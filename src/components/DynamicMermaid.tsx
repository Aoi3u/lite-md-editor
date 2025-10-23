"use client";

import React, { useEffect, useRef } from "react";

interface DynamicMermaidProps {
    chart: string;
}

export default function DynamicMermaid({ chart }: DynamicMermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!containerRef.current) return;

            const mermaid = (await import("mermaid")).default;

            mermaid.initialize({
                startOnLoad: false,
                theme: "default",
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

        renderChart();
    }, [chart]);

    return <div ref={containerRef} className="mermaid-container" />;
}
