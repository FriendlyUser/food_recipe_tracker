// 標籤分類的內容資料。schema 與邏輯（型別、走訪函式）在 src/lib/taxonomy.ts。
import type { Taxonomy } from "../lib/taxonomy";

// 頂層群組 → tags（葉標籤）＋ 選填的巢狀 groups（子群組）。
// 沒列進這棵樹的標籤，會被歸到 Tags 頁的「未分類」。
//
// 下面是配合 demo 文的範例。其中「Language」群組示範了一個做法：本主題是單一語系設計、
// 沒有逐篇語言切換器，但你可以把語言當成一個標籤分面，讓讀者在 Tags 頁分流瀏覽。
export const taxonomy: Taxonomy = {
  Language: {
    defaultOpen: true,
    tags: ["English", "中文"],
  },
  Guides: {
    defaultOpen: true,
    tags: ["Getting Started", "Markdown", "Localization"],
  },
};
