---
title: "Markdown & MDX Syntax"
description: "A tour of every rendering feature: callouts, footnotes, code, tables, and more."
pubDate: 2026-06-18
tags: ["English", "Markdown"]
---

This post exercises the theme's full rendering pipeline. Use it as a reference
while writing, and as a quick visual check after changing the Markdown config.

## Text and inline marks

You can write **bold**, *italic*, ~~strikethrough~~, `inline code`, and
[links](https://astro.build). Footnotes render at the bottom of the post with a
back-reference.[^demo]

## Callouts / admonitions

GitHub-style alert blockquotes are supported via `remark-github-blockquote-alert`:

> [!NOTE]
> Useful information that users should know, even when skimming.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Code blocks

Fenced code blocks get syntax highlighting and a copy button:

```ts
type Post = {
  title: string;
  pubDate: Date;
  tags: string[];
};

const featured = (posts: Post[]) =>
  posts.filter((p) => p.tags.includes("Getting Started"));
```

## Tables

| Feature | Markdown | MDX |
| :--- | :---: | :---: |
| Frontmatter | ✓ | ✓ |
| Components | — | ✓ |
| Callouts | ✓ | ✓ |

## Lists

- Unordered item
  - Nested item
- Another item

1. Ordered item
2. Second item

Task lists also work:

- [x] Write a post
- [ ] Publish it

## Headings and anchors

Every heading gets an anchor link you can hover to copy — handy for sharing a
link straight to a section. The table of contents on post pages is built from
these headings.

## MDX

Rename a file to `.mdx` to import and use Astro/UI components inside your prose.
Plain Markdown (`.md`) covers everything above without any components.

[^demo]: This is the footnote definition. The footnotes section label is
localized to match the site locale.
