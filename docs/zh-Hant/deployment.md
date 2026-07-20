[English](../en/deployment.md) | 繁體中文

# 部署

主題以 `output: static` 建置——產出就是 `dist/` 底下一包單純的 HTML、CSS、JS 和
圖片，任何靜態主機都能服務。隨附的設定針對 Cloudflare Workers Static Assets，
但主題本身沒有任何一處依賴 Cloudflare。

## 先設好 `site`——不管你用哪個主機

在 `astro.config.mjs`：

```js
site: 'https://example.com',
```

這不是選填。canonical 網址、sitemap、RSS 條目連結、`og:image` 絕對網址，以及
`robots.txt` 裡的 `Sitemap:` 那行，全部以它為基底。忘了改就上線的話，這些通通指向
`example.com`——用瀏覽器看一切正常，但對爬蟲和連結預覽而言是靜默壞掉的。

## 建置

```sh
pnpm install
pnpm build        # astro build && pagefind --site dist
```

產出在 `dist/`。CI 或任何非互動環境請用 `CI=true pnpm build`——否則 pnpm 11 會卡在
互動提示。

需要 Node 22+。無論選哪個主機，都確認它的 build image 是 22 或更新；不少平台預設
仍停在較舊的主版本。

## Cloudflare Workers Static Assets（隨附設定）

`wrangler.jsonc` 只宣告 `assets`、沒有 `main`，因此是一個 assets-only Worker。
`pnpm deploy` 會建置並執行 `wrangler deploy`。

兩個設定分量特別重：

- `assets.not_found_handling: "404-page"` —— 沒設的話，自訂 404 只在 `pnpm dev`
  有效，線上會回一片空白的 404。
- `public/_headers` —— 平台預設是 `max-age=0, must-revalidate`。這個檔案對
  `/_astro/*` 與 `/fonts/*` 上 `immutable` 長快取，HTML 維持預設，讓內容更新能
  立即反映。

## 其他主機

建置指令與輸出目錄到哪都一樣：`pnpm build` → `dist/`。差別只在 404 頁面與快取
標頭怎麼表達。

| 主機 | 404 頁面 | 快取標頭 |
| :--- | :--- | :--- |
| **Netlify** | 自動——直接採用 `dist/404.html`。 | `public/_headers` 原樣可用，Netlify 用的是同一種格式。 |
| **Vercel** | 靜態輸出自動處理。 | **不支援** `_headers`——把同樣的規則寫成 `vercel.json` 的 `headers`。 |
| **GitHub Pages** | 自動——會服務 `404.html`。 | 無法設定。你會失去雜湊資產的長快取，但不影響正確性。 |
| **Nginx／Caddy／任何靜態伺服器** | 把錯誤處理指向 `404.html`（`error_page 404 /404.html;`）。 | 在 server 區塊設定。長快取 `/_astro/*` 與 `/fonts/*`，HTML 保持短快取。 |

快取規則沒有看起來那麼要緊：`/_astro/` 底下全都帶內容雜湊，長快取是安全的，設錯
付出的是頻寬而非正確性。真正該守住的一條是**不要長快取 HTML**——否則讀者會一直
看到舊文章。

若你更名了 `public/fonts/`，記得同步改 `@font-face` 引用與對應的 `_headers` 規則。

## 驗證建置結果

```sh
pnpm preview                                      # 建置後用 wrangler dev 服務 dist
pnpm build && find ./dist -maxdepth 10 -type f | wc -l   # 頁面／資產數量
```

`pnpm preview` 是本機能拿到最貼近線上的東西，也是唯一能實測
[搜尋](./search.md) 的方式——搜尋需要建置產生的 Pagefind 索引。

第一次部署後值得檢查一次：`/rss.xml`、`/sitemap-index.xml`、`/robots.txt`、
`/llms.txt` 裡面應該都是你的真實網域，而不是 `example.com`。
