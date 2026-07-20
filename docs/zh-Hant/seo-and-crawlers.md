[English](../en/seo-and-crawlers.md) | 繁體中文

# SEO 與爬蟲

主題對搜尋引擎與 AI 爬蟲說了什麼，以及要改去哪裡改。

以下一切都建立在 `astro.config.mjs` 的 `site` 已經是你的真實網域之上——見
[部署](./deployment.md#先設好-site不管你用哪個主機)。

## robots.txt 與 Content Signals

`src/pages/robots.txt.ts` 在建置期產生 `/robots.txt`，sitemap 網址取自 `site`，
所以沒有寫死的網域。隨附的預設是：

```text
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
```

[Content Signals](https://contentsignals.org) 是 robots.txt 的一個擴充，用來宣告
你的內容**可以被拿去做什麼用途**，而不是誰可以抓。三個旗標彼此獨立，而後兩者的
差別是最常被混淆的一點：

| 旗標 | 意義 | 預設 | 為什麼 |
| :--- | :--- | :--- | :--- |
| `search` | 建立索引、出現在搜尋結果。 | `yes` | 你發文的目的本身。 |
| `ai-input` | 回答當下即時檢索你的頁面作為 AI 回應的依據（RAG）。 | `yes` | 這就是讓 ChatGPT、Perplexity、AI Overviews **附連結引用你**的那條路。關掉它等於把自己從 AI 答案裡移除，是實打實的流量成本。 |
| `ai-train` | 拿你的頁面訓練／微調模型。 | `no` | 單向且不可逆，對你零回報。一個沒人注意到的預設值不該替你做這個決定。 |

要改政策就編輯 `robots.txt.ts` 裡的 `Content-Signal:` 那一行。若你確實希望自己的
文章進入訓練語料，設 `ai-train=yes`；若要最保守的立場，連 `ai-input=no` 一起設
（這組合等同 Cloudflare 的 managed 預設）。

兩個刻意的「不做」：

- **不列具名 bot 的 `Disallow` 區塊。** 沒有 `User-agent: GPTBot` / `ClaudeBot` /
  `CCBot` 這些段落。那份名單變動不斷，把一份會過期的名單烤進主題裡比不寫更糟。
  若你要的是硬性封鎖而非立場宣告，該在 CDN／邊緣做——例如 Cloudflare 就是在網路層
  執行。
- **不對 `/tags/` 下 `Disallow`。** 那些頁面改用自己 meta 標籤裡的
  `noindex, follow`。在 robots.txt 擋掉它們會讓爬蟲連進去 follow 內部文章連結的路
  都斷掉，與你想要的正好相反。

Content Signals 是**偏好宣告**而非強制。會無視 robots.txt 的爬蟲也一樣會無視它。

## noindex，以及誰不進 sitemap

`BaseLayout.astro` 有一個 `noindex` prop，會輸出
`<meta name="robots" content="noindex, follow">`。它被設在 `/tags/*` 與 404 頁：
這些是導覽介面，不是內容。`follow` 才是重點那一半——爬蟲仍會走訪其中的連結。

`astro.config.mjs` 基於同樣理由把 `/tags/*` 從 sitemap 濾掉。一邊在 sitemap 提交
頁面、一邊叫爬蟲別索引它是自相矛盾的，Search Console 會回報「已提交的網址標記為
noindex」。日後你若新增其他 `noindex` 的頁面型別，記得也一併加進 sitemap 的
filter——兩邊要保持一致。

## Sitemap 與 `lastmod`

`@astrojs/sitemap` 產生 `/sitemap-index.xml`。主題額外為文章加上 `lastmod`：在
設定載入時讀每個檔案的 frontmatter，優先取 `updatedDate`、沒有才用 `pubDate`，
讓爬蟲知道哪些頁面真的變動過。

推導 slug 需要在 `astro.config.mjs` 裡重現 Astro glob loader 的 slug 規則。這裡
刻意做成優雅降級：萬一某個檔名對不上，那一頁只是少了 `lastmod`，不會弄壞建置。

## 社群預覽（`og:image`）

`BaseHead.astro` 組出 meta 標籤；`src/lib/og-image.ts` 把圖縮壓成 1200×630 的
JPEG，讓預覽圖不超過各平台的尺寸限制。文章的 `heroImage` 同時就是它的
`og:image`，沒有時退回站台預設圖——所以「給文章配一張 hero」同時也就是「給它一個
好看的連結預覽」。

Twitter 的標籤用 `name=` 而非 `property=`；這符合它的規範，不是筆誤。

## llms.txt

`/llms.txt` 遵循 [llmstxt.org](https://llmstxt.org)：一份給 AI agent 看的純文字
網站導覽，列出所有文章與系列及其描述。它由 blog collection 與
`src/data/series.ts` 自動產生，永遠不需要手動維護。標題與句子取自
`src/i18n/ui.ts` 的 `llms.*` key，因此和其他部分一樣跟著站台語系走。

友站清單（blogroll）刻意排除在 `llms.txt` 與 sitemap 之外：那是通往別人網站的
人類導覽，不是你自己的內容。
