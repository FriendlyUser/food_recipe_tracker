English | [繁體中文](../zh-Hant/search.md)

# Search

Search is powered by [Pagefind](https://pagefind.app): a static index is built
from the generated HTML after Astro finishes, and queried entirely in the
browser. No search service, no API key, no server.

## Search does not work in `pnpm dev`

This is the one thing worth knowing up front. The index is produced by the
second half of the build script:

```jsonc
"build": "astro build && pagefind --site dist"
```

It lives in `dist/pagefind/`, which `astro dev` never generates. Opening the
search overlay in dev shows an explanatory notice instead of results (the
`search.devNotice` string in `src/i18n/ui.ts`) — that is expected, not a bug.

To exercise search for real, use `pnpm preview`: it runs a full build and serves
`dist/` through `wrangler dev`, so you get the same index production will have.

## What gets indexed

Pagefind indexes the *rendered output*, driven by `data-pagefind-*` attributes
in the markup:

| Attribute | Where | Effect |
| :--- | :--- | :--- |
| `data-pagefind-body` | the post `.prose` container in `BlogPost.astro` | Only post bodies enter the index. Pages without it (home, tags, series listings) are skipped entirely. |
| `data-pagefind-ignore` | comments, related posts, chapter nav | Excluded from the surrounding indexed body, so navigation chrome and third-party comment text never pollute results. |
| `data-pagefind-filter="tag"` | each tag chip | Adds a filterable `tag` dimension. |
| `data-pagefind-filter="category"` | hidden span | The post's top-level taxonomy group, including groups reached through implicit tags. |
| `data-pagefind-filter="series"` | hidden span | The series title, when the post is a chapter. |

Because only `data-pagefind-body` regions are indexed, adding a new page type
does **not** automatically make it searchable — add the attribute if you want it
in results.

The three filter dimensions show up as facets in the search UI. They are derived
from content, so they populate themselves as you write: a new tag or series
becomes a filter without touching any search configuration.

## Customizing the UI

The overlay lives in `src/components/Header.astro`. Two places to look:

- **Behavior** — the `PagefindUI` constructor (`showImages`, `showSubResults`,
  and the `translations` block, which reads its strings from `src/i18n/ui.ts`
  under the `search.*` keys, so search follows the site locale like everything
  else).
- **Appearance** — the `#pagefind-search` CSS block, which maps Pagefind's
  `--pagefind-ui-*` variables onto the theme's palette tokens. Note the
  duplicate override under the dark selector: Pagefind's own stylesheet is
  injected at runtime and declares dark-mode values on `:root`, so it would
  otherwise win on specificity/order.

If you use `ClientRouter` navigation, keep `ensurePagefindCss()` in mind — the
Pagefind stylesheet is appended to `<head>` at runtime and view transitions swap
`<head>` out, so it has to be re-added after navigation. That helper already
handles it; it is the reason search styling survives page swaps.
