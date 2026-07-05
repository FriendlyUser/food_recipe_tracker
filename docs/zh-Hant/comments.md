[English](../en/comments.md) | 繁體中文

# 留言板

留言板預設關閉，全部設定都在 `src/data/comments.ts`——你選一個 provider、填好它
的區塊、決定何時載入。隨附的 provider 是 [Giscus](https://giscus.app)（以 GitHub
Discussions 為後端）。

## 啟用 Giscus

1. 在你的 GitHub repo 開啟 **Discussions**，然後到 [giscus.app](https://giscus.app)
   針對該 repo 做設定。它會給你 `repoId`、`categoryId` 與 mapping——皆非機密，可
   進 repo。
2. 在 `src/data/comments.ts` 把 `provider` 設成 `'giscus'`，並用那些值填好
   `giscus` 區塊：

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

你不用設 `theme`——`<Comments>` 元件會盯著 `<html>` 的 `.dark`/`.light` class，
自動把 Giscus 同步成淺／深色。

## 載入時機

`loading` 欄位控制第三方腳本何時載入：

| 值 | 行為 |
| :--- | :--- |
| `'eager'` | 一進頁面就載。 |
| `'lazy'` | 留言區快滑進視窗才載（預設——兼顧效能與零點擊摩擦）。 |
| `'click'` | 讀者按按鈕才載（第三方接觸壓到最低）。 |

## 換用其他 provider

這份設定與 provider 無關。第三方託管（Disqus、Utterances）與自託管（Waline、
Artalk）後端都走同一套掛載模式——載一支 JS client、用 config 呼叫 `init()`、掛進
一個 `<div>`——所以新增一個是局部小改、不是重寫。照 `comments.ts` 裡的說明：

1. 把該 provider 的代號加進 `CommentsProvider` union。
2. 自託管的話，照 `GiscusConfig` 的樣子加一個含 `serverURL`（指向你後端）的子設定型別。
3. 到 `src/components/` 加一支對應元件（照 `GiscusComments.astro` 的樣子）。
4. 到 `Comments.astro` 的 `switch` 補一個 `case`。

共用外殼、載入策略、View Transitions 重掛都與 provider 無關，新 provider 白拿。
主題刻意只隨附實際在用的 provider，避免帶進無法驗證的死碼。

> 註：站上預設沒有 Content-Security-Policy，所以自託管腳本不會被擋。若你日後加了
> CSP，記得把你後端的網域加進 `script-src` / `connect-src`。
