import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            typography: ({ theme }: { theme: (path: string) => string }) => ({
                DEFAULT: {
                    css: {
                        "--tw-prose-body": theme("colors.foreground / 0.85"),
                        "--tw-prose-headings": theme("colors.foreground"),
                        "--tw-prose-lead": theme("colors.foreground / 0.9"),
                        "--tw-prose-links": theme("colors.blue.600"),
                        "--tw-prose-bold": theme("colors.foreground"),
                        "--tw-prose-counters": theme("colors.muted.foreground"),
                        "--tw-prose-bullets": theme("colors.muted.foreground"),
                        "--tw-prose-hr": theme("colors.border"),
                        "--tw-prose-quotes": theme("colors.foreground"),
                        "--tw-prose-quote-borders": theme("colors.border"),
                        "--tw-prose-captions": theme("colors.muted.foreground"),
                        "--tw-prose-code": theme("colors.pink.600"),
                        "--tw-prose-pre-code": theme("colors.foreground / 0.9"),
                        "--tw-prose-pre-bg": theme("colors.secondary.DEFAULT"),
                        "--tw-prose-th-borders": theme("colors.border"),
                        "--tw-prose-td-borders": theme("colors.border"),

                        "--tw-prose-invert-body": theme(
                            "colors.foreground / 0.85"
                        ),
                        "--tw-prose-invert-headings":
                            theme("colors.foreground"),
                        "--tw-prose-invert-lead": theme(
                            "colors.foreground / 0.9"
                        ),
                        "--tw-prose-invert-links": theme("colors.blue.400"),
                        "--tw-prose-invert-bold": theme("colors.foreground"),
                        "--tw-prose-invert-counters": theme(
                            "colors.muted.foreground"
                        ),
                        "--tw-prose-invert-bullets": theme(
                            "colors.muted.foreground"
                        ),
                        "--tw-prose-invert-hr": theme("colors.border"),
                        "--tw-prose-invert-quotes": theme("colors.foreground"),
                        "--tw-prose-invert-quote-borders":
                            theme("colors.border"),
                        "--tw-prose-invert-captions": theme(
                            "colors.muted.foreground"
                        ),
                        "--tw-prose-invert-code": theme("colors.pink.400"),
                        "--tw-prose-invert-pre-code": theme(
                            "colors.foreground / 0.9"
                        ),
                        "--tw-prose-invert-pre-bg": theme(
                            "colors.secondary.DEFAULT"
                        ),
                        "--tw-prose-invert-th-borders": theme("colors.border"),
                        "--tw-prose-invert-td-borders": theme("colors.border"),

                        "code::before": { content: "none" },
                        "code::after": { content: "none" },
                        pre: {
                            paddingTop: theme("spacing.3"),
                            paddingBottom: theme("spacing.3"),
                            paddingLeft: theme("spacing.4"),
                            paddingRight: theme("spacing.4"),
                            borderRadius: theme("borderRadius.md"),
                        },
                        "p, li": {
                            lineHeight: "1.6",
                        },
                        "h1, h2, h3, h4, h5, h6": {
                            fontWeight: theme("fontWeight.semibold"),
                        },
                    },
                },
            }),
        },
    },
    plugins: [typography],
};
export default config;
