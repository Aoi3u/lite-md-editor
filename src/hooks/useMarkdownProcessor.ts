import { useMemo } from "react";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

export function useMarkdownProcessor(markdown: string) {
    const md = useMemo(() => {
        return new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
        });
    }, []);

    const sanitizedHTML = useMemo(() => {
        const rawHTML = md.render(markdown);
        let purifier: { sanitize?: (s: string) => string } | null = null;

        const dompurifyUnknown = DOMPurify as unknown;

        if (typeof dompurifyUnknown === "function") {
            try {
                const factory = dompurifyUnknown as (win?: Window) => {
                    sanitize: (s: string) => string;
                };
                purifier = factory(
                    typeof window !== "undefined" ? window : undefined
                );
            } catch {
                purifier = null;
            }
        }

        if (!purifier) {
            if (
                typeof dompurifyUnknown === "object" &&
                dompurifyUnknown !== null
            ) {
                const obj = dompurifyUnknown as {
                    sanitize?: unknown;
                    default?: unknown;
                };
                if (typeof obj.sanitize === "function") {
                    purifier = obj as { sanitize: (s: string) => string };
                } else if (obj.default) {
                    const defUnknown = obj.default as unknown;
                    if (
                        typeof (defUnknown as { sanitize?: unknown })
                            .sanitize === "function"
                    ) {
                        purifier = defUnknown as {
                            sanitize: (s: string) => string;
                        };
                    }
                }
            }

            if (!purifier && typeof window !== "undefined") {
                const w = window as unknown as { DOMPurify?: unknown };
                if (w.DOMPurify) {
                    const wUnknown = w.DOMPurify as unknown;
                    if (
                        typeof (wUnknown as { sanitize?: unknown }).sanitize ===
                        "function"
                    ) {
                        purifier = wUnknown as {
                            sanitize: (s: string) => string;
                        };
                    }
                }
            }
        }

        if (!purifier || typeof purifier.sanitize !== "function") {
            if (typeof window !== "undefined") {
                console.warn(
                    "DOMPurify not available — rendering unsanitized HTML."
                );
            }
            return rawHTML;
        }

        return purifier.sanitize(rawHTML);
    }, [markdown, md]);

    return sanitizedHTML;
}
