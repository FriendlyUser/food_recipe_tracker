English | [繁體中文](../zh-Hant/content.md)

# Content

How to author posts, group them into series, and organize them with tags.

## Posts

Posts are Markdown or MDX files in `src/content/blog/`. The filename (without
extension) is the slug and the URL: `my-post.md` → `/blog/my-post/`. The
frontmatter schema is enforced at build time in `src/content.config.ts`.

| Field | Required | Notes |
| :--- | :--- | :--- |
| `title` | yes | Post title. |
| `pubDate` | yes | Publish date (`YYYY-MM-DD`). Drives ordering and the RSS feed. |
| `description` | no | Used for meta description and social previews. If omitted, a snippet is derived from the body. |
| `updatedDate` | no | Shown as "last updated" when present. |
| `heroImage` | no | Path relative to the post file, e.g. `../../assets/post-hero.jpg`. Goes through Astro's image optimizer. Falls back to `src/assets/hero-image-holder.jpg`. |
| `tags` | no | Array of strings. See [Tags](#tags). |
| `pinned` | no | `true` pins one post to the top of the home page. Pin only one. |

`heroImage` doubles as the `og:image` for that post (downscaled to 1200×630 JPEG
by `src/lib/og-image.ts`), so give posts a hero if you care about link previews.

## Series

A series is an ordered, tree-structured reading path — think a multi-part guide.
Content lives in `src/data/series.ts`; the types and logic are in
`src/lib/series.ts`. The shape is three levels deep:

```
domain (URL slug)          e.g. "guides"  → /series/guides/
└── series (URL slug)      e.g. "getting-started-en" → /series/guides/getting-started-en/
    └── part (display only)  e.g. "Basics"
        └── chapter          → { slug: "getting-started" }  (points at a post)
```

- **Domain** and **series** keys become URL segments, so they must be URL-safe
  slugs (lowercase alphanumerics and hyphens). The display name is the separate
  `title` field — this keeps renames from breaking links.
- **Parts** are display-only groupings within a series (like "Basics",
  "Advanced"); they don't appear in the URL.
- **Chapters** reference a post by its `slug` (the filename). A chapter's
  `title` is optional — it falls back to the post's own title.
- `heroImage` on a domain or series points at a file in `src/assets/series/`
  using its full glob key, e.g. `/src/assets/series/guide-en.webp`. Omit it to
  get a gradient placeholder. `heroDarkness` (0–1, default 0.5) controls the
  overlay used to keep title text legible over the image.
- `featured: true` surfaces a series in the home page's featured section.

Everything above is **validated at build time** — a wrong chapter slug, a
non-slug key, or a `heroImage` pointing at a missing file **fails the build**
with a message naming the offender, rather than silently rendering a broken link
or a fallback gradient. This is deliberate: these are typo classes TypeScript
can't catch on its own.

## Tags

Tags are just strings on a post's `tags` frontmatter. `src/data/taxonomy.ts`
organizes them into a browsable tree for the Tags page; the traversal logic is
in `src/lib/taxonomy.ts`.

```ts
export const taxonomy: Taxonomy = {
  Guides: {
    defaultOpen: true,
    tags: ["Getting Started", "Markdown", "Localization"],
    // groups: { ... }  // optional nested subgroups
  },
};
```

- A top-level entry is a **group** with a list of leaf `tags`, and optionally
  nested `groups` for a deeper tree.
- `defaultOpen` controls whether the group starts expanded on the Tags page.
- Any tag used on a post but **not** listed in the tree is collected under an
  "Uncategorized" bucket automatically — you don't have to register every tag,
  only the ones you want structured.
- `/tags/*` pages are `noindex` (they're navigation, not content), and are
  excluded from the sitemap accordingly.

## Language as a facet (single-locale sites)

The theme is single-locale by design — there is no per-post language switcher
(see the README's [Internationalization](../../README.md#internationalization)
section). If you want to publish in more than one language on one site, use tags
and series as language facets rather than reaching for full i18n:

- Add a `Language` tag group (`["English", "中文"]`) so readers can filter by
  language on the Tags page.
- Give each language its own series, so a reading path never mixes languages.

The bundled demo content does exactly this: an English "Getting Started" series
and a Chinese「開始使用」series under one `guides` domain, with a `Language`
facet in the taxonomy. It's content organization, not translation — the UI
chrome stays in the one configured locale.
