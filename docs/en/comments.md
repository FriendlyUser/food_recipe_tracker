English | [繁體中文](../zh-Hant/comments.md)

# Comments

Comments are off by default and configured entirely in `src/data/comments.ts` —
you pick a provider, fill in its block, and choose when it loads. The shipped
provider is [Giscus](https://giscus.app) (GitHub Discussions backed).

## Enabling Giscus

1. Enable **Discussions** on your GitHub repo, then visit
   [giscus.app](https://giscus.app) and configure it against that repo. It gives
   you `repoId`, `categoryId`, and the mapping — all non-secret, safe to commit.
2. In `src/data/comments.ts`, set `provider: 'giscus'` and fill in the `giscus`
   block with those values:

   ```ts
   export const commentsConfig: CommentsConfig = {
     provider: 'giscus',
     loading: 'lazy',
     giscus: {
       repo: 'your-name/your-repo',
       repoId: 'R_xxxxxxxxxx',
       category: 'Announcements',
       categoryId: 'DIC_xxxxxxxxxx',
       mapping: 'pathname',
       reactionsEnabled: true,
       inputPosition: 'bottom',
     },
   };
   ```

You don't set a `theme` — the `<Comments>` component syncs Giscus to light/dark
by watching the `.dark`/`.light` class on `<html>`.

## Load strategy

The `loading` field controls when the third-party script loads:

| Value | Behavior |
| :--- | :--- |
| `'eager'` | Load immediately on page view. |
| `'lazy'` | Load when the comments area scrolls into view (default — good perf, zero clicks). |
| `'click'` | Load only when the reader clicks a button (minimal third-party contact). |

## Using a different provider

The config is provider-agnostic. Third-party hosted (Disqus, Utterances) and
self-hosted (Waline, Artalk) backends all follow the same mount pattern — load a
JS client, call `init()` with a config, mount into a `<div>` — so adding one is
localized, not a rewrite. Per the notes in `comments.ts`:

1. Add the provider's id to the `CommentsProvider` union.
2. For self-hosted backends, add a config sub-type modeled on `GiscusConfig`,
   with an extra `serverURL` field pointing at your backend.
3. Add a component under `src/components/` modeled on `GiscusComments.astro`.
4. Add a `case` for it in the `switch` in `Comments.astro`.

The shared shell, loading strategies, and View-Transitions re-mount are all
provider-agnostic, so a new provider gets them for free. The theme intentionally
ships only the provider it actually uses, to avoid unverifiable dead code.

> Note: there's no Content-Security-Policy on the site by default, so a
> self-hosted script won't be blocked. If you add a CSP later, remember to
> allow your backend's domain in `script-src` / `connect-src`.
