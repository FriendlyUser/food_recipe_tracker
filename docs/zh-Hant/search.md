[English](../en/search.md) | 繁體中文

# 搜尋

搜尋由 [Pagefind](https://pagefind.app) 驅動：Astro 建置完成後，從產出的 HTML
建一份靜態索引，查詢完全在瀏覽器端完成。不需要搜尋服務、不需要 API key、不需要
後端。

## `pnpm dev` 底下搜尋不會動

這是最該先知道的一件事。索引是 build 腳本的後半段產生的：

```jsonc
"build": "astro build && pagefind --site dist"
```

它位於 `dist/pagefind/`，而 `astro dev` 從不產生這個目錄。在 dev 打開搜尋浮層會
看到一段說明文字而非搜尋結果（字串是 `src/i18n/ui.ts` 的 `search.devNotice`）
——這是預期行為，不是壞掉。

要真的測搜尋，用 `pnpm preview`：它會跑完整 build 再用 `wrangler dev` 服務
`dist/`，拿到的索引與線上完全相同。

## 哪些內容會進索引

Pagefind 索引的是**渲染後的產出**，由標記裡的 `data-pagefind-*` 屬性控制：

| 屬性 | 位置 | 作用 |
| :--- | :--- | :--- |
| `data-pagefind-body` | `BlogPost.astro` 的 `.prose` 容器 | 只有文章本體進索引。沒有這個屬性的頁面（首頁、tags、series 列表）整頁跳過。 |
| `data-pagefind-ignore` | 留言板、相似文章、章節導覽 | 從所屬的索引區塊中排除，避免導覽介面與第三方留言文字污染搜尋結果。 |
| `data-pagefind-filter="tag"` | 每個標籤 chip | 新增可過濾的 `tag` 維度。 |
| `data-pagefind-filter="category"` | 隱藏 span | 文章的頂層分類群組，包含透過隱含 tag 掛上的群組。 |
| `data-pagefind-filter="series"` | 隱藏 span | 文章是某系列的章節時，該系列的標題。 |

因為只有 `data-pagefind-body` 的區域會進索引，新增一種頁面型別**不會**自動變成
可搜尋——想讓它出現在結果裡就得補上這個屬性。

三個過濾維度會以分面形式出現在搜尋 UI。它們都從內容推導而來，寫著寫著就自己長出
來：新增一個標籤或系列就多一個過濾選項，不用碰任何搜尋設定。

## 客製化搜尋 UI

浮層在 `src/components/Header.astro`，有兩個地方要看：

- **行為** —— `PagefindUI` 建構子（`showImages`、`showSubResults`，以及
  `translations` 區塊；它的字串取自 `src/i18n/ui.ts` 的 `search.*` key，所以搜尋
  和其他部分一樣跟著站台語系走）。
- **外觀** —— `#pagefind-search` 的 CSS 區塊，把 Pagefind 的 `--pagefind-ui-*`
  變數對應到主題的配色 token。注意深色選擇器底下有一份重複覆蓋：Pagefind 自己的
  stylesheet 是執行時插入的，且在 `:root` 上宣告深色值，不重寫一次會被它蓋掉。

若你用 `ClientRouter` 導覽，記得 `ensurePagefindCss()` 的存在——Pagefind 的
stylesheet 是執行時附加到 `<head>` 的，而 View Transitions 換頁會抽換 `<head>`，
所以換頁後必須補回。那個函式已經處理掉了，搜尋樣式能跨換頁存活就是靠它。
