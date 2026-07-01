---
title: "開始使用碧落"
description: "安裝主題、設定你的站，並發佈第一篇文章。"
pubDate: 2026-06-19
heroImage: "../../assets/post-hero-zh.jpg"
tags: ["中文", "Getting Started"]
---

歡迎使用 **碧落 / Biluo** —— 一個注重效能與排版的 Astro 部落格主題。
這篇是 demo 內容，等你熟悉之後，把 `src/content/blog/` 下的文章刪掉，開始寫自己的。

> [!NOTE]
> 這是一篇*示範*文，用來展示主題語法、同時讓建置保持零警告。請換成你自己的內容。

## 安裝與啟動

```bash
pnpm install
pnpm dev        # 開發伺服器 localhost:4321
pnpm build      # 建置到 ./dist，含 Pagefind 搜尋索引
pnpm preview    # 以 wrangler dev 服務 dist（最貼近線上）
```

## 設定你的站

讓站台「變成你的」的設定集中在這幾個檔：

| 想改什麼 | 在哪 |
| :--- | :--- |
| 站名、描述、作者、社群連結 | `src/consts.ts` |
| UI 字串與站台語系 | `src/i18n/ui.ts` |
| 標籤分類 | `src/data/taxonomy.ts` |
| 系列文 | `src/data/series.ts` |
| 留言板（Giscus） | `src/data/comments.ts` |

> [!TIP]
> 留言板預設**關閉**，且 provider 可抽換。內建 Giscus——到 `src/data/comments.ts`
> 把 `provider` 設成 `'giscus'`，再填入 [giscus.app](https://giscus.app) 給的值即可。
> 同一個檔也寫了如何照相同掛載模式接上自託管後端（Waline、Artalk 等）。

## 寫一篇文章

在 `src/content/blog/` 下新增 Markdown 或 MDX 檔。frontmatter schema
（`src/content.config.ts`）支援：

```yaml
---
title: "我的第一篇文章"       # 必填
description: "一段簡短摘要"    # 選填，省略時退回內文
pubDate: 2026-06-29          # 必填
updatedDate: 2026-06-30      # 選填
heroImage: "../../assets/my-hero.jpg" # 選填，會經 Astro 優化
tags: ["中文", "Getting Started"]
pinned: false
---
```

省略 `heroImage` 時，主題會用內建的預設圖，所以沒有自備圖的文章看起來一樣完整。

## 關於字體

內文中文走 **昭源圜方（Chiron GoRound TC）**、拉丁字母與數字走 **Nunito**、
等寬走 **Monaspace Radon**，三套皆為 SIL OFL 1.1（見 `NOTICE` 與
`public/fonts/` 下各 `OFL.txt`）。中文用 CFF 輪廓並依字頻切片載入，所以首屏只下載
用到的那幾片。若你的站不需要中文，可以換成純拉丁字體並省下這套切片——
做法見英文版的 [Going English-first](/blog/going-english-first/)。

> [!IMPORTANT]
> 本主題是**單一語系設計**：UI 隨附繁體中文，`src/i18n/ui.ts` 的 `siteLocale`
> 是全站語系的單一真相來源。完整語法導覽見 [Markdown 語法](/blog/markdown-syntax-zh/)。
