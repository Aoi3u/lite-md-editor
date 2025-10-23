"use client";

import React, { useState, useMemo, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import MarkdownIt from "markdown-it";

export default function MainEditor() {
    const [value, setValue] = useState("# Hello Markdown\n\nStart editing...");
    const [sanitizedHTML, setSanitizedHTML] = useState("");

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

    return (
        <div className="flex h-screen w-full">
            <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="h-full overflow-auto">
                    <CodeMirror
                        value={value}
                        height="100vh"
                        extensions={[markdown()]}
                        onChange={(val) => setValue(val)}
                        theme="light"
                        className="h-full"
                    />
                </div>
            </div>

            <div className="w-1/2 bg-gray-50 dark:bg-gray-800">
                <div className="h-full overflow-auto p-6">
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                    />
                </div>
            </div>
        </div>
    );
}
