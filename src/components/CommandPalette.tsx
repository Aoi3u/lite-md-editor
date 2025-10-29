"use client";

import React, { useEffect, useState, useRef } from "react";

interface Item {
    id: string;
    title: string;
    description?: string;
    template: string;
}

interface Props {
    items: Item[];
    position: { top: number; left: number } | null;
    onSelect: (item: Item) => void;
    onClose: (removeSlash?: boolean) => void;
}

export default function CommandPalette({
    items,
    position,
    onSelect,
    onClose,
}: Props) {
    const [index, setIndex] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (!position) return;
        requestAnimationFrame(() => setIndex(0));
    }, [position]);

    useEffect(() => {
        if (!position) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopImmediatePropagation();
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                e.stopImmediatePropagation();
                setIndex((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                e.stopImmediatePropagation();
                setIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                e.stopImmediatePropagation();
                onSelect(items[index]);
            } else if (
                e.key.length === 1 &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.altKey
            ) {
                onClose(false);
            }
        };

        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [position, index, items, onSelect, onClose]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const child = list.children?.[index] as HTMLElement | undefined;
        if (child)
            child.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [index]);

    useEffect(() => {
        if (!position) return;
        const onDown = (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            const target = e.target as Node | null;
            if (!target || !el.contains(target)) onClose();
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [position, onClose]);

    if (!position) return null;

    return (
        <div
            ref={ref}
            className="command-palette"
            style={{
                position: "absolute",
                top: position.top + 6,
                left: position.left,
            }}
            role="dialog"
            aria-label="Command Palette"
        >
            <ul
                ref={listRef}
                className="cp-list"
                role="listbox"
                aria-activedescendant={items[index]?.id ?? undefined}
            >
                {items.map((it, i) => (
                    <li
                        id={it.id}
                        key={it.id}
                        role="option"
                        aria-selected={i === index}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(it);
                        }}
                        onMouseEnter={() => setIndex(i)}
                        className={`cp-item ${i === index ? "active" : ""}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="cp-title">{it.title}</div>
                            <div className="text-xs text-muted-foreground">
                                /
                            </div>
                        </div>
                        {it.description ? (
                            <div className="cp-desc">{it.description}</div>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}
