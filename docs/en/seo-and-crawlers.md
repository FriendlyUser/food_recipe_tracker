English | [繁體中文](../zh-Hant/seo-and-crawlers.md)

# SEO and crawlers

What the theme tells search engines and AI crawlers, and where to change it.

All of this depends on `site` in `astro.config.mjs` being your real domain —
see [Deployment](./deployment.md#set-site-first--on-every-host).

## robots.txt and Content Signals

`src/pages/robots.txt.ts` generates `/robots.txt` at build time, taking the
sitemap URL from `site` so there is no hardcoded domain. The shipped default:

```text
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
```

[Content Signals](https://contentsignals.org) is a robots.txt extension for
declaring what your content may be *used for*, as opposed to who may fetch it.
The three flags are independent, and the difference between the last two is the
one people usually miss:

| Flag | Means | Default | Why |
| :--- | :--- | :--- | :--- |
| `search` | Index the page and show it in search results. | `yes` | The reason you publish. |
| `ai-input` | Retrieve the page at answer time to ground an AI response (RAG). | `yes` | This is what lets ChatGPT, Perplexity, and AI Overviews **cite you with a link**. Turning it off removes you from AI answers — a real traffic cost. |
| `ai-train` | Use the page to train or fine-tune a model. | `no` | One-way and irreversible, and it returns nothing to you. A default nobody noticed should not opt you into it. |

To change the policy, edit the `Content-Signal:` line in `robots.txt.ts`. Set
`ai-train=yes` if you actively want your writing in training corpora; set
`ai-input=no` as well for the maximally protective stance (this matches
Cloudflare's managed default).

Two deliberate non-decisions:

- **No named-bot `Disallow` blocks.** No `User-agent: GPTBot` / `ClaudeBot` /
  `CCBot` sections. That list churns constantly, and a stale list baked into a
  theme is worse than none. If you want hard blocking rather than a stated
  preference, do it at your CDN or edge — Cloudflare, for instance, enforces
  this at the network layer.
- **No `Disallow` for `/tags/`.** Those pages carry `noindex, follow` in their
  own meta tag instead. Blocking them in robots.txt would stop crawlers from
  entering and following the post links inside, which is the opposite of what
  you want.

Content Signals are a *declaration of preference*, not enforcement. A crawler
that ignores robots.txt will ignore this too.

## noindex, and what stays out of the sitemap

`BaseLayout.astro` takes a `noindex` prop that emits
`<meta name="robots" content="noindex, follow">`. It is set on `/tags/*` and the
404 page: navigation surfaces, not content. `follow` is the important half —
crawlers still traverse the links.

`astro.config.mjs` filters `/tags/*` out of the sitemap for the same reason.
Submitting a page in the sitemap while telling crawlers not to index it is a
contradiction, and Search Console reports it as "Submitted URL marked
noindex". If you add another `noindex` page type, exclude it from the sitemap
filter too — keep the two in agreement.

## Sitemap and `lastmod`

`@astrojs/sitemap` generates `/sitemap-index.xml`. The theme adds a `lastmod`
for posts by reading each file's frontmatter at config-load time, preferring
`updatedDate` over `pubDate`, so crawlers can tell what actually changed.

Deriving the slug requires reproducing Astro's glob-loader slug rules in
`astro.config.mjs`. This is intentionally fail-soft: if a filename ever stops
matching, that page simply loses its `lastmod` rather than breaking the build.

## Social previews (`og:image`)

`BaseHead.astro` builds the meta tags; `src/lib/og-image.ts` downscales the
image to a 1200×630 JPEG so previews stay under platform size limits. A post's
`heroImage` doubles as its `og:image`, falling back to the site default when
absent — so giving a post a hero is also what gives it a good link preview.

Twitter's tags use `name=` rather than `property=`; that is correct per its
spec, not a typo.

## llms.txt

`/llms.txt` follows [llmstxt.org](https://llmstxt.org): a plain-text site guide
for AI agents, listing every post and series with descriptions. It is generated
from the blog collection and `src/data/series.ts`, so it never needs manual
maintenance.

> [!NOTE]
> `src/pages/llms.txt.ts` has a few section headings and one sentence written
> directly in Traditional Chinese rather than pulled from `src/i18n/ui.ts`. If
> you run an English-first site, translate those strings in that file.

The blogroll is deliberately excluded from both `llms.txt` and the sitemap: it
is human navigation to other people's sites, not content of your own.
