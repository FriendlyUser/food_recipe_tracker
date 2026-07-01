// 系列文的內容資料。schema 與邏輯（型別、getChapterContext）在 src/lib/series.ts。
import type { SeriesData } from "../lib/series";

// key 直接成為 URL 段（/series/<domain>/<series>/），必須是小寫英數連字號的
// slug；顯示名稱放 title。建置期會驗證（見 lib/series.ts validateSeriesData）。
// heroImage 是選填，指向 src/assets/series/ 下你自備的圖（建置期經 Astro 優化）；
// 省略時系列卡會用一張漸層底圖。
//
// 下面是配合 demo 文的範例：一個 domain「Guides」底下放英文與中文兩個語言一致的系列，
// 同時示範了用 series 來為不同語言分流（呼應 taxonomy.ts 的 Language 分面）。
export const seriesData: SeriesData = {
  guides: {
    title: "Guides",
    heroImage: "/src/assets/series/guide-en.webp",
    heroDarkness: 0.5,
    series: {
      "getting-started-en": {
        title: "Getting Started (English)",
        description: "Install the theme, learn the syntax, make it your own.",
        heroImage: "/src/assets/series/guide-en.webp",
        heroDarkness: 0.45,
        featured: true,
        parts: [
          {
            title: "Basics",
            chapters: [
              { slug: "getting-started" },
              { slug: "markdown-syntax" },
              { slug: "going-english-first" },
            ],
          },
        ],
      },
      "ru-men-zh": {
        title: "開始使用（中文）",
        description: "安裝主題、認識語法、改成自己的站。",
        heroImage: "/src/assets/series/guide-zh.webp",
        heroDarkness: 0.45,
        featured: true,
        parts: [
          {
            title: "基礎",
            chapters: [
              { slug: "getting-started-zh" },
              { slug: "markdown-syntax-zh" },
            ],
          },
        ],
      },
    },
  },
};
