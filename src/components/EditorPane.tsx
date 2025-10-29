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
    onDocChange?: (view: EditorView) => void;
    onSlash?: (view: EditorView, pos: number) => void;
}

export default function EditorPane({
    value,
    onChange,
    onEditorCreate,
    scrollExtension,
    onDocChange,
    onSlash,
}: EditorPaneProps) {
    const { theme } = useTheme();
    const showLineNumbers = true;

    const resolvedExtension =
        scrollExtension && "current" in scrollExtension
            ? scrollExtension.current
            : scrollExtension;

    const extensions = useMemo(() => {
        const slashHandler = onSlash
            ? EditorView.domEventHandlers({
                  keydown: (event, view) => {
                      try {
                          if (
                              event.key === "/" &&
                              !event.metaKey &&
                              !event.ctrlKey &&
                              !event.altKey
                          ) {
                              event.preventDefault();
                              const pos = view.state.selection.main.head;
                              onSlash(view, pos);
                              return;
                          }
                      } catch {
                          // ignore
                      }
                  },
              })
            : null;
        const updateListener = onDocChange
            ? EditorView.updateListener.of((v) => {
                  try {
                      if (v.docChanged) onDocChange(v.view);
                  } catch {
                      // ignore
                  }
              })
            : null;

        const baseExtensions = [
            slashHandler,
            updateListener,
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
    }, [resolvedExtension, showLineNumbers, onSlash, onDocChange]);

    return (
        <div className="h-full overflow-hidden relative flex-1">
            {/* Placeholder overlay when editor is empty */}
            {(!value || !value.trim()) && (
                <div className="pointer-events-none absolute left-1/2 top-1/3 z-10 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[color-mix(in_srgb,hsl(var(--card))_88%,transparent)] dark:bg-[color-mix(in_srgb,hsl(var(--card))_60%,transparent)] text-2xl font-semibold text-foreground shadow-md border border-[hsl(var(--border))]">
                        <span aria-hidden className="select-none">
                            /
                        </span>
                    </div>
                    <div
                        style={{ color: "hsl(var(--foreground) / 0.9)" }}
                        className="text-base font-medium"
                    >
                        Press{" "}
                        <span
                            className="inline-flex items-center px-2 py-0.5 mx-1 rounded bg-[color-mix(in_srgb,hsl(var(--border))_92%,transparent)] text-sm"
                            aria-hidden
                        >
                            /
                        </span>{" "}
                        to open templates
                    </div>
                    <div className="text-sm text-muted opacity-70">
                        Insert quick Markdown, math, or diagram snippets
                    </div>
                </div>
            )}
            <CodeMirror
                value={value}
                height="100%"
                extensions={extensions}
                onChange={onChange}
                onCreateEditor={onEditorCreate}
                theme={theme === "dark" ? githubDark : githubLight}
                className="h-full absolute inset-0 z-0"
            />
        </div>
    );
}
