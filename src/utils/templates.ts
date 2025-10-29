export interface TemplateItem {
    id: string;
    title: string;
    description?: string;
    template: string;
}

export const TEMPLATES: TemplateItem[] = [
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
        description: "```lang\\ncode\\n```",
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
        description: "$...$",
        template: "$e^{i\\pi} + 1 = 0$",
    },
    {
        id: "display-math",
        title: "Display math",
        description: "$$...$$",
        template: "$$\n\\frac{a}{b} = c\n$$\n\n",
    },
    {
        id: "mermaid",
        title: "Mermaid diagram",
        description: "mermaid sequence diagram",
        template:
            "```mermaid\nsequenceDiagram\n    Alice->>Bob: Hello Bob, how are you?\n```\n\n",
    },
];
