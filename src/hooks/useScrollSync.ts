import { useRef, useEffect, useState } from "react";
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

interface UseScrollSyncOptions {
    isEnabled?: boolean;
}

export function useScrollSync({ isEnabled = true }: UseScrollSyncOptions = {}) {
    const editorViewRef = useRef<EditorView | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const syncLockRef = useRef<"editor" | "preview" | null>(null);
    const extensionRef = useRef<Extension | null>(null);
    const [extension, setExtension] = useState<Extension | null>(null);

    useEffect(() => {
        if (!isEnabled) return;

        const ext = EditorView.domEventHandlers({
            scroll: (event, view) => {
                if (!isEnabled || syncLockRef.current === "preview") return;

                syncLockRef.current = "editor";
                const previewDiv = previewRef.current;
                if (!previewDiv) {
                    syncLockRef.current = null;
                    return;
                }

                const scroller = view.scrollDOM;
                const editorScrollHeight =
                    scroller.scrollHeight - scroller.clientHeight;
                const previewScrollHeight =
                    previewDiv.scrollHeight - previewDiv.clientHeight;

                if (editorScrollHeight > 0 && previewScrollHeight > 0) {
                    const ratio = scroller.scrollTop / editorScrollHeight;
                    previewDiv.scrollTop = ratio * previewScrollHeight;
                } else if (scroller.scrollTop === 0) {
                    previewDiv.scrollTop = 0;
                }

                requestAnimationFrame(() => {
                    syncLockRef.current = null;
                });
            },
        });

        extensionRef.current = ext as Extension;
        setExtension(extensionRef.current);

        return () => {
            extensionRef.current = null;
            setExtension(null);
        };
    }, [isEnabled]);

    useEffect(() => {
        if (!isEnabled) return;

        const previewDiv = previewRef.current;
        if (!previewDiv) return;

        const handlePreviewScroll = () => {
            if (syncLockRef.current === "editor") return;
            syncLockRef.current = "preview";

            const view = editorViewRef.current;
            if (!view) {
                syncLockRef.current = null;
                return;
            }

            const scroller = view.scrollDOM;
            const editorScrollHeight =
                scroller.scrollHeight - scroller.clientHeight;
            const previewScrollHeight =
                previewDiv.scrollHeight - previewDiv.clientHeight;

            if (previewScrollHeight > 0 && editorScrollHeight > 0) {
                const ratio = previewDiv.scrollTop / previewScrollHeight;
                scroller.scrollTop = ratio * editorScrollHeight;
            } else if (previewDiv.scrollTop === 0) {
                scroller.scrollTop = 0;
            }

            requestAnimationFrame(() => {
                syncLockRef.current = null;
            });
        };

        previewDiv.addEventListener("scroll", handlePreviewScroll);
        return () =>
            previewDiv.removeEventListener("scroll", handlePreviewScroll);
    }, [isEnabled]);

    return {
        editorViewRef,
        previewRef,
        scrollExtension: extension,
    };
}
