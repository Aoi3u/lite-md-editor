"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import { useTheme } from "@/contexts/ThemeContext";

interface EditorPaneProps {
    value: string;
    onChange: (value: string) => void;
    onEditorCreate?: (view: EditorView) => void;
    scrollExtension?: ReturnType<typeof EditorView.domEventHandlers>;
}

export default function EditorPane({
    value,
    onChange,
    onEditorCreate,
    scrollExtension,
}: EditorPaneProps) {
    const { theme } = useTheme();

    return (
        <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 h-full overflow-hidden">
            <CodeMirror
                value={value}
                height="100%"
                extensions={[markdown(), scrollExtension].filter(Boolean)}
                onChange={onChange}
                onCreateEditor={onEditorCreate}
                theme={theme === "dark" ? githubDark : githubLight}
                className="h-full"
            />
        </div>
    );
}

