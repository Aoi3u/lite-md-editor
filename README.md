# Lite Markdown Editor

軽量でリアルタイムプレビュー機能を備えた Markdown エディタ

---

## 概要

Lite Markdown Editor は、Next.js 16（App Router）と TypeScript を用いた小さな Markdown エディタです。
エディタ（CodeMirror）とプレビューを並べて表示し、KaTeX や Mermaid を遅延読み込みしてリアルタイムにレンダリングします。

## 主な機能

-   2 ペイン（エディタ / プレビュー）
-   リアルタイムプレビュー（markdown-it）
-   スクロール同期（双方向）
-   ダークモード（ユーザー設定 / システム優先）
-   KaTeX による数式レンダリング（インライン / ブロック）
-   Mermaid によるダイアグラム描画（遅延読み込み）
-   コマンドパレット（`/` でテンプレート挿入）
-   Markdown ファイルのエクスポート
-   XSS 対策に DOMPurify を利用

## 使い方

ローカルで開発する手順:

```bash
git clone https://github.com/Aoi3u/lite-md-editor.git
cd lite-md-editor
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

本番ビルド:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## スラッシュコマンド / テンプレート

-   エディタ内で `/` を押すとテンプレートパレットが開きます。
-   矢印キーで選択、Enter で挿入、Esc または外側クリックで閉じます。
-   テンプレート一覧は `src/utils/templates.ts` で管理します。

挿入されるテンプレート例: 見出し、リスト、リンク、画像、表、コードブロック、数式、Mermaid 図など。

※ `/` の後に文字をタイプするとパレットは閉じられ `/` は残ります（例: `/a`）。

## 技術スタック

-   Next.js 16 (App Router)
-   React 19 / TypeScript
-   Tailwind CSS
-   @uiw/react-codemirror (CodeMirror 6)
-   markdown-it
-   DOMPurify
-   KaTeX (dynamic import)
-   Mermaid (dynamic import)

## 開発上の注意 / 既知の挙動

-   KaTeX / Mermaid はクライアント側で動的に読み込まれます。初回レンダリングではプレースホルダーが表示されます。
-   テーマ（ライト/ダーク）はクライアントの環境に依存するため、サーバーレンダリング時と初回クライアント描画で差が生じないよう、テーマ依存の描画はマウント後に行う工夫を入れています。
-   1 件、CSS の @import によるビルド時の警告が発生する場合がありますが、現状ビルド自体は成功しています。

## 開発に関するファイル

-   `src/components/MainEditor.tsx` — メインの編集 UI
-   `src/components/EditorPane.tsx` — CodeMirror をラップしているコンポーネント
-   `src/components/MarkdownPreview.tsx` — HTML を解析して KaTeX / Mermaid を埋め込むプレビュー
-   `src/contexts/ThemeContext.tsx` — テーマ管理
-   `src/hooks/useMarkdownProcessor.ts` — markdown-it + DOMPurify を使った変換
-   `src/hooks/useScrollSync.ts` — スクロール同調ロジック
-   `src/utils/templates.ts` — スラッシュコマンド用テンプレート定義

## 貢献

PR / Issue は歓迎します。小さな変更でも気軽に送ってください。

## ライセンス

MIT License
