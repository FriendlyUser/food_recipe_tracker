---
title: "Markdown 與 MDX 語法"
description: "走過每一個渲染功能：callout、註腳、程式碼、表格等等。"
pubDate: 2026-06-17
tags: ["中文", "Markdown"]
---

這篇把主題的完整渲染管線都跑一遍。寫作時可當速查，改完 Markdown 設定後也能用它快速目視檢查。

## 文字與行內標記

可以寫**粗體**、*斜體*、~~刪除線~~、`行內程式碼`、[連結](https://astro.build)。
註腳會渲染在文章底部並附回連結。[^demo]

## Callout／提示區塊

透過 `remark-github-blockquote-alert` 支援 GitHub 風格的警示區塊：

> [!NOTE]
> 即使快速瀏覽也該知道的有用資訊。

> [!TIP]
> 把事情做得更好、更輕鬆的小建議。

> [!IMPORTANT]
> 達成目標所必須知道的關鍵資訊。

> [!WARNING]
> 需要立即注意、以免出問題的緊急資訊。

> [!CAUTION]
> 提醒某些操作的風險或負面後果。

## 程式碼區塊

圍欄程式碼區塊有語法高亮與複製按鈕：

```ts
type Post = {
  title: string;
  pubDate: Date;
  tags: string[];
};

const featured = (posts: Post[]) =>
  posts.filter((p) => p.tags.includes("Getting Started"));
```

## 表格

| 功能 | Markdown | MDX |
| :--- | :---: | :---: |
| Frontmatter | ✓ | ✓ |
| 元件 | — | ✓ |
| Callout | ✓ | ✓ |

## 清單

- 無序項目
  - 巢狀項目
- 另一個項目

1. 有序項目
2. 第二項

待辦清單也可以：

- [x] 寫一篇文章
- [ ] 發佈它

## 標題與錨點

每個標題都有錨點連結，滑過去就能複製——方便直接分享到某個段落。文章頁左側的目錄
（TOC）就是用這些標題建出來的。

## MDX

把副檔名改成 `.mdx`，就能在文章裡 import 並使用 Astro／UI 元件。上面這些用純
Markdown（`.md`）就能達成，不需要任何元件。

[^demo]: 這是註腳定義。註腳區塊的標籤會依站台語系在地化（中文顯示為「註解」）。
