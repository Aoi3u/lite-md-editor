export function useExport(content: string) {
    const exportToFile = (fileName?: string) => {
        try {
            const blob = new Blob([content], {
                type: "text/markdown;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            let fname = (fileName || "document").trim();
            if (!fname) fname = "document";
            if (!fname.toLowerCase().endsWith(".md")) {
                fname = `${fname}.md`;
            }

            a.download = fname;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {}
    };

    return exportToFile;
}
