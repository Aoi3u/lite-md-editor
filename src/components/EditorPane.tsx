"use client";

import React, { useMemo } from "react";
import type { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLineGutter,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    highlightActiveLine,
} from "@codemirror/view";
import {
    indentOnInput,
    bracketMatching,
    foldGutter,
    foldKeymap,
} from "@codemirror/language";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
    autocompletion,
    completionKeymap,
    closeBrackets,
    closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { EditorState } from "@codemirror/state";

import { useTheme } from "@/contexts/ThemeContext";

interface EditorPaneProps {
    value: string;
    onChange: (value: string) => void;
    onEditorCreate?: (view: EditorView) => void;
    scrollExtension?:
        | ReturnType<typeof EditorView.domEventHandlers>
        | React.RefObject<Extension | null>
        | null;
}

export default function EditorPane({
    value,
    onChange,
    onEditorCreate,
    scrollExtension,
}: EditorPaneProps) {
    const { theme } = useTheme();
    const showLineNumbers = true;

    const resolvedExtension =
        scrollExtension && "current" in scrollExtension
            ? scrollExtension.current
            : scrollExtension;

    const extensions = useMemo(() => {
        const baseExtensions = [
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),

            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap,
            ]),

            markdown(),
            resolvedExtension,
            showLineNumbers && lineNumbers(),
            showLineNumbers && highlightActiveLineGutter(),
            foldGutter(),
        ];
        return baseExtensions.filter(Boolean) as Extension[];
    }, [resolvedExtension, showLineNumbers]);

    return (
        <div className="w-1/2 h-full overflow-hidden relative">
            <CodeMirror
                value={value}
                height="100%"
                extensions={extensions}
                onChange={onChange}
                onCreateEditor={onEditorCreate}
                theme={theme === "dark" ? githubDark : githubLight}
                className="h-full absolute inset-0"
            />
        </div>
    );
}
