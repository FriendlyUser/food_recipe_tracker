[English](../en/content.md) | 繁體中文

# 內容

如何撰寫文章、把文章組成系列，以及用標籤來組織它們。

## 文章

文章是 `src/content/blog/` 底下的 Markdown 或 MDX 檔。檔名（不含副檔名）就是
slug，也是 URL：`my-post.md` → `/blog/my-post/`。frontmatter 的 schema 在
`src/content.config.ts` 於建置期強制驗證。

| 欄位 | 必填 | 說明 |
| :--- | :--- | :--- |
| `title` | 是 | 文章標題。 |
| `pubDate` | 是 | 發布日期（`YYYY-MM-DD`）。決定排序與 RSS。 |
| `description` | 否 | 用於 meta description 與社群預覽。省略時會從內文擷取一段。 |
| `updatedDate` | 否 | 有值時顯示為「最後更新於」。 |
| `heroImage` | 否 | 相對於文章檔的路徑，例如 `../../assets/post-hero.jpg`。會經 Astro 圖片優化。省略時退回 `src/assets/hero-image-holder.jpg`。 |
| `tags` | 否 | 字串陣列。見 [標籤](#標籤)。 |
| `pinned` | 否 | `true` 會把該篇置頂到首頁。只置頂一篇。 |

`heroImage` 同時也是該篇的 `og:image`（由 `src/lib/og-image.ts` 縮壓成
1200×630 JPEG）；在意連結預覽的話，記得幫文章配一張 hero。

## 系列文

系列文是一條有序、樹狀結構的閱讀路徑——想成一份多篇的教學。內容資料在
`src/data/series.ts`，型別與邏輯在 `src/lib/series.ts`。結構共三層：

```
domain（URL slug）          例如 "guides"  → /series/guides/
└── series（URL slug）      例如 "getting-started-en" → /series/guides/getting-started-en/
    └── part（僅顯示用）      例如 "Basics"
        └── chapter          → { slug: "getting-started" }（指向一篇文章）
```

- **domain** 與 **series** 的 key 會直接成為 URL 段，所以必須是 URL-safe 的
  slug（小寫英數與連字號）。顯示名稱放另外的 `title` 欄位——如此改名不會斷鏈。
- **part** 是系列內部僅供顯示的分組（像「基礎」「進階」）；不會出現在 URL。
- **chapter** 用 `slug`（檔名）指向一篇文章。chapter 的 `title` 選填——省略時
  退回文章自己的 title。
- domain 或 series 上的 `heroImage` 用完整 glob key 指向 `src/assets/series/`
  下的檔案，例如 `/src/assets/series/guide-en.webp`。省略時會用漸層底圖。
  `heroDarkness`（0–1，預設 0.5）控制蓋在圖上、確保標題文字可讀的遮罩深淺。
- `featured: true` 會讓該系列出現在首頁的精選區。

以上全部都在**建置期驗證**——章節 slug 打錯、key 不是合法 slug、`heroImage`
指向不存在的檔案，都會**讓 build 失敗**並指出是哪一個，而不是默默渲染成斷鏈或
退回漸層底。這是刻意的：這些都是 TypeScript 自己抓不到的錯字類型。

## 標籤

標籤只是文章 `tags` frontmatter 裡的字串。`src/data/taxonomy.ts` 把它們組織成
Tags 頁上一棵可瀏覽的樹；走訪邏輯在 `src/lib/taxonomy.ts`。

```ts
export const taxonomy: Taxonomy = {
  Guides: {
    defaultOpen: true,
    tags: ["Getting Started", "Markdown", "Localization"],
    // groups: { ... }  // 選填的巢狀子群組
  },
};
```

- 頂層一筆是一個**群組**，帶一串葉標籤 `tags`，並可選填巢狀 `groups` 做更深的樹。
- `defaultOpen` 控制該群組在 Tags 頁是否預設展開。
- 任何用在文章上、但**沒**列進這棵樹的標籤，會被自動歸到「未分類」桶——你不必
  登記每一個標籤，只登記你想要結構化的那些。
- `/tags/*` 頁是 `noindex`（它們是導覽、不是內容），並據此排除於 sitemap 之外。

## 把語言當成分面（單一語系站）

本主題刻意採單一語系設計——沒有逐篇語言切換器（見 README 的
[國際化](../../README.zh-Hant.md#國際化)一節）。若你想在同一個站上以多種語言發文，
把標籤與系列當成語言分面用，而不是去動真正的 i18n：

- 加一個 `Language` 標籤群組（`["English", "中文"]`），讓讀者能在 Tags 頁依語言分流。
- 讓每種語言各有自己的系列，如此一條閱讀路徑不會混語言。

隨附的 demo 內容正是這麼做：一個 domain `guides` 底下放英文的 "Getting Started"
系列與中文的「開始使用」系列，taxonomy 裡有一個 `Language` 分面。這是內容組織、
不是翻譯——UI 介面文字仍維持在設定的那一個語系。
