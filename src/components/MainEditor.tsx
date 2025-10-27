"use client";

import React, { useState } from "react";
import { EditorView } from "@codemirror/view";
import Toolbar from "./Toolbar";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";
import { useMarkdownProcessor } from "@/hooks/useMarkdownProcessor";
import { useScrollSync } from "@/hooks/useScrollSync";
import { useExport } from "@/hooks/useExport";
import { INITIAL_MARKDOWN } from "@/utils/constants";

export default function MainEditor() {
    const [value, setValue] = useState(INITIAL_MARKDOWN);

    const sanitizedHTML = useMarkdownProcessor(value);
    const exportToFile = useExport(value);
    const { editorViewRef, previewRef, scrollExtension } = useScrollSync();

    const handleEditorCreate = (view: EditorView) => {
        editorViewRef.current = view;
    };

    const resolvedScrollExtension =
        (scrollExtension as unknown as { current?: unknown })?.current ??
        scrollExtension;

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
            <Toolbar onExport={exportToFile} />
            <div className="flex flex-1 overflow-hidden relative">
                <EditorPane
                    value={value}
                    onChange={setValue}
                    onEditorCreate={handleEditorCreate}
                    scrollExtension={
                        resolvedScrollExtension as ReturnType<
                            typeof EditorView.domEventHandlers
                        > | null
                    }
                />
                <div className="w-px bg-border cursor-col-resize hover:bg-ring transition-colors" />
                <PreviewPane
                    html={sanitizedHTML}
                    previewRef={
                        previewRef as React.RefObject<HTMLDivElement | null>
                    }
                />
            </div>
        </div>
    );
}
