---
title: "Getting Started with Biluo"
description: "Install the theme, configure your site, and publish your first post."
pubDate: 2026-06-20
heroImage: "../../assets/post-hero-en.jpg"
tags: ["English", "Getting Started"]
pinned: true
---

Welcome to **Biluo (碧落)** — a clean, performance-focused Astro blog theme.
This post is part of the demo content; once you're comfortable, delete the
posts under `src/content/blog/` and start writing your own.

> [!NOTE]
> This is a *demo* post. It exists to show you the theme's syntax and to keep
> the build warning-free. Replace it with your own content.

## Install and run

```bash
pnpm install
pnpm dev        # dev server at localhost:4321
pnpm build      # build to ./dist with a Pagefind search index
pnpm preview    # serve dist with wrangler dev (closest to production)
```

## Configure your site

Most of what makes the site *yours* lives in a few files:

| What | Where |
| :--- | :--- |
| Title, description, author, social links | `src/consts.ts` |
| UI strings and site locale | `src/i18n/ui.ts` |
| Tags taxonomy | `src/data/taxonomy.ts` |
| Series | `src/data/series.ts` |
| Comments (Giscus) | `src/data/comments.ts` |

> [!TIP]
> Comments ship **off** by default and are provider-swappable. Giscus is built
> in — set `provider: 'giscus'` in `src/data/comments.ts` and fill in the values
> from [giscus.app](https://giscus.app). The same file documents how to wire up a
> self-hosted backend (Waline, Artalk, …) following the same mount pattern.

## Write a post

Create a Markdown or MDX file under `src/content/blog/`. The frontmatter schema
(`src/content.config.ts`) accepts:

```yaml
---
title: "My first post"        # required
description: "A short summary" # optional, falls back to the body
pubDate: 2026-06-29            # required
updatedDate: 2026-06-30        # optional
heroImage: "../../assets/my-hero.jpg" # optional, optimized by Astro
tags: ["English", "Getting Started"]
pinned: false
---
```

If you omit `heroImage`, the theme uses a built-in default, so a post without
its own image still looks complete.[^hero]

## A note on language

Biluo is **single-locale by design**: the UI ships in Traditional Chinese, and
`siteLocale` in `src/i18n/ui.ts` is the single source of truth. If you want an
English-first site, read [Going English-first](/blog/going-english-first/). For
the full Markdown feature tour, see [Markdown syntax](/blog/markdown-syntax/).

[^hero]: The fallback lives at `src/assets/hero-image-holder.jpg`. Replace it to
change the default look across every post and the social card.
