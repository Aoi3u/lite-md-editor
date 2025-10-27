import { useState, useEffect, useMemo } from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

export function useMarkdownProcessor(markdown: string) {
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
        const rawHTML = md.render(markdown);
        setSanitizedHTML(DOMPurify.sanitize(rawHTML));
    }, [markdown, md]);

    return sanitizedHTML;
}

