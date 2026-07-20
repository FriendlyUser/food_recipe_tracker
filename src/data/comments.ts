// 留言板設定（provider 無關的對外介面）。
// 要啟用留言只要動這個檔：選 provider、填對應區塊、決定載入時機。
// 一次 build 只有一個 provider 生效；刻意不預先寫沒在用的 provider，避免死碼。
//
// 想接新後端（Disqus、Utterances、Waline、Artalk…）的完整步驟見
// docs/zh-Hant/comments.md（英文版 docs/en/comments.md）。

export type CommentsProvider = 'none' | 'giscus';

// 載入時機：
//   'eager' 一進頁面就載；
//   'lazy'  留言區快滑進視窗才載（IntersectionObserver）——預設，兼顧效能與零點擊摩擦；
//   'click' 讀者按按鈕才載，第三方接觸壓到最低。
export type CommentsLoading = 'eager' | 'lazy' | 'click';

// Giscus 子設定。值到 https://giscus.app 設定後取得。
export type GiscusConfig = {
  repo: `${string}/${string}`;       // 'owner/repo'
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title';
  reactionsEnabled: boolean;
  inputPosition: 'top' | 'bottom';
  // 主題同步由 <Comments> 自行處理（盯 <html> 的 .dark/.light），這裡不必填 theme。
};

export type CommentsConfig = {
  provider: CommentsProvider;
  loading: CommentsLoading;
  giscus?: GiscusConfig;
};

export const commentsConfig: CommentsConfig = {
  provider: 'none', // 'none' = 不渲染留言區（預設）；要啟用 Giscus 改成 'giscus' 並填妥下面的 giscus 區塊
  loading: 'lazy',
  giscus: {
    // 到 https://giscus.app 依指示為你的 repo 啟用 GitHub Discussions 後取得以下值（皆非機密，可進 repo）。
    repo: 'your-name/your-repo',
    repoId: 'R_xxxxxxxxxx',
    category: 'Announcements',
    categoryId: 'DIC_xxxxxxxxxx',
    mapping: 'pathname',
    reactionsEnabled: true,
    inputPosition: 'bottom',
  },
};
