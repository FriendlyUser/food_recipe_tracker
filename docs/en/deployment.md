English | [繁體中文](../zh-Hant/deployment.md)

# Deployment

The theme builds to `output: static` — a plain folder of HTML, CSS, JS, and
images in `dist/`. Any static host can serve it. The bundled configuration
targets Cloudflare Workers Static Assets, but nothing in the theme depends on
Cloudflare.

## Set `site` first — on every host

In `astro.config.mjs`:

```js
site: 'https://example.com',
```

This is not optional. It is the base for canonical URLs, the sitemap, RSS item
links, `og:image` absolute URLs, and the `Sitemap:` line in `robots.txt`. Ship
with the placeholder and every one of those points at `example.com` — the site
will look fine in a browser and be quietly broken for crawlers and link
previews.

## Build

```sh
pnpm install
pnpm build        # astro build && pagefind --site dist
```

Output goes to `dist/`. In CI or any non-interactive environment use
`CI=true pnpm build` — pnpm 11 otherwise blocks on an interactive prompt.

Node 22+ is required. Whatever host you pick, make sure its build image is on
22 or newer; several platforms still default to an older major.

## Cloudflare Workers Static Assets (bundled setup)

`wrangler.jsonc` declares `assets` with no `main`, which makes it an
assets-only Worker. `pnpm deploy` builds and runs `wrangler deploy`.

Two settings carry real weight:

- `assets.not_found_handling: "404-page"` — without it the custom 404 works in
  `pnpm dev` and returns a blank 404 in production.
- `public/_headers` — the platform default is `max-age=0, must-revalidate`.
  The file puts `immutable` long-cache on `/_astro/*` and `/fonts/*` while
  leaving HTML on the default so content updates appear immediately.

## Other hosts

The build command and output directory are the same everywhere:
`pnpm build` → `dist/`. What differs is how you express the 404 page and cache
headers.

| Host | 404 page | Cache headers |
| :--- | :--- | :--- |
| **Netlify** | Automatic — `dist/404.html` is used as-is. | `public/_headers` works verbatim; Netlify uses the same format. |
| **Vercel** | Automatic for static output. | `_headers` is **not** supported — express the same rules as `headers` in `vercel.json`. |
| **GitHub Pages** | Automatic — serves `404.html`. | Not configurable. You lose the long-cache on hashed assets; correctness is unaffected. |
| **Nginx / Caddy / any static server** | Point the error handler at `404.html` (`error_page 404 /404.html;`). | Configure in the server block. Long-cache `/_astro/*` and `/fonts/*`; keep HTML short. |

Cache rules matter less than they look: everything under `/_astro/` is
content-hashed, so long-caching it is safe, and getting it wrong costs
bandwidth rather than correctness. The one rule worth preserving is *not*
long-caching HTML — otherwise readers keep seeing stale posts.

If you rename `public/fonts/`, update both the `@font-face` references and the
matching `_headers` rule.

## Verifying a build

```sh
pnpm preview                                      # build + serve dist via wrangler dev
pnpm build && find ./dist -maxdepth 10 -type f | wc -l   # page/asset count
```

`pnpm preview` is the closest thing to production available locally, and it is
the only way to exercise [search](./search.md), which needs the built Pagefind
index.

Worth checking once after the first deploy: `/rss.xml`, `/sitemap-index.xml`,
`/robots.txt`, and `/llms.txt` should all contain your real domain rather than
`example.com`.
