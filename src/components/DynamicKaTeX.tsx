"use client";

import React, { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";

interface DynamicKaTeXProps {
    math: string;
    displayMode?: boolean;
}

export default function DynamicKaTeX({
    math,
    displayMode = false,
}: DynamicKaTeXProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const renderMath = async () => {
            if (!containerRef.current) return;

            const katex = (await import("katex")).default;
            try {
                katex.render(math, containerRef.current, {
                    displayMode,
                    throwOnError: false,
                });
            } catch (error) {
                console.error("KaTeX rendering error:", error);
                if (containerRef.current) {
                    containerRef.current.textContent = math;
                }
            }
        };

        renderMath();
    }, [math, displayMode]);

    return <span ref={containerRef} />;
}
