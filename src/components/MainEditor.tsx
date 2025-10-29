"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { EditorView } from "@codemirror/view";
import CommandPalette from "@/components/CommandPalette";
import Toolbar from "./Toolbar";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";
import { useMarkdownProcessor } from "@/hooks/useMarkdownProcessor";
import { useScrollSync } from "@/hooks/useScrollSync";
import { useExport } from "@/hooks/useExport";
import { INITIAL_MARKDOWN } from "@/utils/constants";

export default function MainEditor() {
    const [value, setValue] = useState(INITIAL_MARKDOWN);

    // Command palette state
    const [palettePosition, setPalettePosition] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const lastSlashPosRef = useRef<number | null>(null);
    const lastSlashViewRef = useRef<EditorView | null>(null);

    const sanitizedHTML = useMarkdownProcessor(value);
    const exportToFile = useExport(value);
    const { editorViewRef, previewRef, scrollExtension } = useScrollSync();

    const handleEditorCreate = (view: EditorView) => {
        editorViewRef.current = view;
    };

    const templates = [
        {
            id: "h1",
            title: "Heading 1",
            description: "# Heading 1",
            template: "# Heading 1\n\n",
        },
        {
            id: "h2",
            title: "Heading 2",
            description: "## Heading 2",
            template: "## Heading 2\n\n",
        },
        {
            id: "h3",
            title: "Heading 3",
            description: "### Heading 3",
            template: "### Heading 3\n\n",
        },
        {
            id: "bold",
            title: "Bold text",
            description: "**bold**",
            template: "**Bold text**",
        },
        {
            id: "italic",
            title: "Italic text",
            description: "*italic*",
            template: "*Italic text*",
        },
        {
            id: "link",
            title: "Link",
            description: "[label](https://example.com)",
            template: "[Example](https://example.com)",
        },
        {
            id: "image",
            title: "Image",
            description: "![alt](https://example.com/image.png)",
            template: "![Alt text](https://example.com/image.png)\n\n",
        },
        {
            id: "ul",
            title: "Unordered list",
            description: "- item",
            template: "- Item 1\n- Item 2\n- Item 3\n\n",
        },
        {
            id: "ol",
            title: "Ordered list",
            description: "1. item",
            template: "1. First item\n2. Second item\n3. Third item\n\n",
        },
        {
            id: "tasks",
            title: "Task list",
            description: "- [ ] task",
            template: "- [ ] Todo item 1\n- [x] Completed item\n\n",
        },
        {
            id: "blockquote",
            title: "Blockquote",
            description: "> quote",
            template: "> A short quote or note.\n\n",
        },
        {
            id: "table",
            title: "Table",
            description: "Simple 2-column table",
            template:
                "| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n\n",
        },
        {
            id: "hr",
            title: "Horizontal rule",
            description: "---",
            template: "---\n\n",
        },
        {
            id: "codeblock",
            title: "Code block",
            description: "```lang\ncode\n```",
            template: '```js\nconsole.log("hello")\n```\n\n',
        },
        {
            id: "inline-code",
            title: "Inline code",
            description: "`code`",
            template: "`const x = 1;`",
        },
        {
            id: "inline-math",
            title: "Inline math",
            description: "`$...$`",
            template: "`$e^{i\\pi} + 1 = 0$`",
        },
        {
            id: "display-math",
            title: "Display math",
            description: "```$$...$$```",
            template: "```\n$$\n\\frac{a}{b} = c\n$$\n```\n",
        },
        {
            id: "mermaid",
            title: "Mermaid diagram",
            description: "mermaid sequence diagram",
            template:
                "```mermaid\nsequenceDiagram\n    Alice->>Bob: Hello Bob, how are you?\n```\n\n",
        },
    ];

    const handleSlash = useCallback((view: EditorView, pos: number) => {
        try {
            // The editor prevented the default '/' insertion; insert it explicitly
            const newPos = pos + 1;
            view.dispatch({
                changes: { from: pos, to: pos, insert: "/" },
                selection: { anchor: newPos },
                scrollIntoView: true,
            });

            // compute coords at the position after the inserted slash
            const coords = view.coordsAtPos(newPos) || view.coordsAtPos(pos);
            if (!coords) return;
            const left = coords.left + window.scrollX;
            const top = coords.bottom + window.scrollY;
            setPalettePosition({ left, top });
            lastSlashPosRef.current = newPos;
            lastSlashViewRef.current = view;
            // ensure editor keeps focus
            view.focus();
        } catch {
            // ignore
        }
    }, []);

    // detect when user removes the slash manually — close palette
    const handleDocChange = (view: EditorView) => {
        try {
            const slashPos = lastSlashPosRef.current;
            if (typeof slashPos !== "number") return;
            // character before slashPos should be '/'
            const start = Math.max(0, slashPos - 1);
            const ch = view.state.doc.sliceString(start, start + 1);
            if (ch !== "/") {
                // user removed the slash — close palette and do not try to remove slash
                closePalette(false);
            }
        } catch {
            // ignore
        }
    };

    const closePalette = (removeSlash = true) => {
        // If canceling (removeSlash=true) and we have a recorded slash, remove it
        try {
            if (removeSlash) {
                const view = editorViewRef.current ?? lastSlashViewRef.current;
                const slashPos = lastSlashPosRef.current;
                if (view && typeof slashPos === "number") {
                    const from = Math.max(0, slashPos - 1);
                    const to = slashPos;
                    // remove the single slash character
                    view.dispatch({ changes: { from, to, insert: "" } });
                }
            }
        } catch {
            // ignore
        }

        setPalettePosition(null);
        lastSlashPosRef.current = null;
        lastSlashViewRef.current = null;
    };

    const handlePaletteSelect = (item: { template: string }) => {
        const view = editorViewRef.current ?? lastSlashViewRef.current;
        const slashPos =
            lastSlashPosRef.current ?? view?.state.selection.main.head ?? 0;
        if (!view) return;
        const from = Math.max(0, slashPos - 1);
        const to = slashPos; // replace the slash char
        view.dispatch({
            changes: { from, to, insert: item.template },
            selection: { anchor: from + item.template.length },
            scrollIntoView: true,
        });
        // close without removing (we already replaced slash)
        closePalette(false);
        // ensure focus remains in editor
        view.focus();
    };

    const resolvedScrollExtension =
        (scrollExtension as unknown as { current?: unknown })?.current ??
        scrollExtension;

    const layoutRef = useRef<HTMLElement | null>(null);
    const isDragging = useRef(false);

    const startDrag = useCallback(() => {
        const el = layoutRef.current;
        if (!el) return;
        isDragging.current = true;

        const onMoveMouse = (e: MouseEvent) => {
            const pageX = e.clientX;
            const rect = el.getBoundingClientRect();
            let leftPct = (pageX - rect.left) / rect.width;
            leftPct = Math.max(0.15, Math.min(0.85, leftPct));
            const rightPct = 1 - leftPct;
            el.style.gridTemplateColumns = `${Math.round(
                leftPct * 100
            )}% auto ${Math.round(rightPct * 100)}%`;
        };

        const onMoveTouch = (e: TouchEvent) => {
            const pageX = e.touches?.[0]?.clientX ?? 0;
            const rect = el.getBoundingClientRect();
            let leftPct = (pageX - rect.left) / rect.width;
            leftPct = Math.max(0.15, Math.min(0.85, leftPct));
            const rightPct = 1 - leftPct;
            el.style.gridTemplateColumns = `${Math.round(
                leftPct * 100
            )}% auto ${Math.round(rightPct * 100)}%`;
            e.preventDefault();
        };

        const stop = () => {
            isDragging.current = false;
            window.removeEventListener("mousemove", onMoveMouse);
            window.removeEventListener("touchmove", onMoveTouch);
            window.removeEventListener("mouseup", stop);
            window.removeEventListener("touchend", stop);
        };

        window.addEventListener("mousemove", onMoveMouse);
        window.addEventListener("touchmove", onMoveTouch, { passive: false });
        window.addEventListener("mouseup", stop);
        window.addEventListener("touchend", stop);
    }, []);

    useEffect(() => {
        return () => {
            isDragging.current = false;
        };
    }, []);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        startDrag();
    };

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = () => {
        startDrag();
    };

    return (
        <div className="app-shell">
            <Toolbar onExport={exportToFile} />

            <CommandPalette
                items={templates}
                position={palettePosition}
                onSelect={handlePaletteSelect}
                onClose={closePalette}
            />

            <main className="editor-layout" ref={layoutRef}>
                <section className="pane">
                    <div className="pane-header">
                        <strong>Editor</strong>
                    </div>
                    <EditorPane
                        value={value}
                        onChange={setValue}
                        onEditorCreate={handleEditorCreate}
                        onSlash={handleSlash}
                        onDocChange={handleDocChange}
                        scrollExtension={
                            resolvedScrollExtension as ReturnType<
                                typeof EditorView.domEventHandlers
                            > | null
                        }
                    />
                </section>

                <div
                    className="divider"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize editor and preview"
                    tabIndex={0}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onDoubleClick={() => {
                        const el = layoutRef.current;
                        if (!el) return;
                        el.style.gridTemplateColumns = `50% auto 50%`;
                    }}
                    onKeyDown={(e) => {
                        const el = layoutRef.current;
                        if (!el) return;
                        const left = el.children[0] as HTMLElement;
                        const rect = el.getBoundingClientRect();
                        const leftW = left.getBoundingClientRect().width;
                        const curPct = leftW / rect.width;
                        const step = 0.03; // 3%
                        if (e.key === "ArrowLeft") {
                            const next = Math.max(0.15, curPct - step);
                            el.style.gridTemplateColumns = `${Math.round(
                                next * 100
                            )}% auto ${Math.round((1 - next) * 100)}%`;
                            e.preventDefault();
                        } else if (e.key === "ArrowRight") {
                            const next = Math.min(0.85, curPct + step);
                            el.style.gridTemplateColumns = `${Math.round(
                                next * 100
                            )}% auto ${Math.round((1 - next) * 100)}%`;
                            e.preventDefault();
                        } else if (e.key === "Home") {
                            el.style.gridTemplateColumns = `15% auto 85%`;
                            e.preventDefault();
                        } else if (e.key === "End") {
                            el.style.gridTemplateColumns = `85% auto 15%`;
                            e.preventDefault();
                        } else if (e.key === "Enter") {
                            el.style.gridTemplateColumns = `50% auto 50%`;
                            e.preventDefault();
                        }
                    }}
                />

                <section className="pane">
                    <div className="pane-header">
                        <strong>Preview</strong>
                    </div>
                    <PreviewPane
                        html={sanitizedHTML}
                        previewRef={
                            previewRef as React.RefObject<HTMLDivElement | null>
                        }
                    />
                </section>
            </main>
        </div>
    );
}
