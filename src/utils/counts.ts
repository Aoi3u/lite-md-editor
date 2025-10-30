export type Counts = {
    words: number;
    charsWithSpaces: number;
    charsNoSpaces: number;
    charsNoWhitespace: number;
    charsNoNewlines: number;
    lines: number;
};

export function computeCounts(input?: string): Counts {
    const s = input ?? "";
    const words = (() => {
        const t = s.replace(/\n+/g, " ").trim();
        if (!t) return 0;
        return t.split(/\s+/).filter(Boolean).length;
    })();
    const charsWithSpaces = s.length;
    const charsNoSpaces = s.replace(/ /g, "").length;
    const charsNoWhitespace = s.replace(/\s+/g, "").length;
    const charsNoNewlines = s.replace(/\n/g, "").length;
    const lines = s ? s.split(/\r?\n/).length : 0;
    return {
        words,
        charsWithSpaces,
        charsNoSpaces,
        charsNoWhitespace,
        charsNoNewlines,
        lines,
    };
}
