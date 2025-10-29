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
import { TEMPLATES } from "@/utils/templates";

export default function MainEditor() {
    const [value, setValue] = useState(INITIAL_MARKDOWN);

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

    const templates = TEMPLATES;

    const handleSlash = useCallback((view: EditorView, pos: number) => {
        try {
            const newPos = pos + 1;
            view.dispatch({
                changes: { from: pos, to: pos, insert: "/" },
                selection: { anchor: newPos },
                scrollIntoView: true,
            });

            const coords = view.coordsAtPos(newPos) || view.coordsAtPos(pos);
            if (!coords) return;
            const left = coords.left + window.scrollX;
            const top = coords.bottom + window.scrollY;
            setPalettePosition({ left, top });
            lastSlashPosRef.current = newPos;
            lastSlashViewRef.current = view;
            view.focus();
        } catch {}
    }, []);

    const handleDocChange = (view: EditorView) => {
        try {
            const slashPos = lastSlashPosRef.current;
            if (typeof slashPos !== "number") return;
            const start = Math.max(0, slashPos - 1);
            const ch = view.state.doc.sliceString(start, start + 1);
            if (ch !== "/") closePalette(false);
        } catch {}
    };

    const closePalette = (removeSlash = true) => {
        try {
            if (removeSlash) {
                const view = editorViewRef.current ?? lastSlashViewRef.current;
                const slashPos = lastSlashPosRef.current;
                if (view && typeof slashPos === "number") {
                    const from = Math.max(0, slashPos - 1);
                    const to = slashPos;
                    view.dispatch({ changes: { from, to, insert: "" } });
                }
            }
        } catch {}
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
        const to = slashPos;
        view.dispatch({
            changes: { from, to, insert: item.template },
            selection: { anchor: from + item.template.length },
            scrollIntoView: true,
        });
        closePalette(false);
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

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = () =>
        startDrag();

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
                        const step = 0.03;
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
