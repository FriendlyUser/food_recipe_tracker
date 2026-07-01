// 留言板設定（provider 無關的對外介面）。
// 開源使用者只要動這個檔：選 provider、填對應區塊、決定載入時機——
// 其餘程式碼不用碰。一次 build 只有一個 provider 生效。
//
// 想接新後端的人——第三方託管（Disqus、Utterances）或自託管（Waline、Artalk
// 等指向你自己後端的系統）都走同一條路，因為它們掛載模式相同：載一支 JS client
// → 用 config 呼叫 init() → 掛進一個 <div>。自託管的差別只是 config 多一個指向
// 你後端的 serverURL 欄位（站上目前無 CSP，自託管腳本不會被擋；日後若加 CSP，
// 記得把你的網域加進 script-src / connect-src）。步驟：
//   1. 把代號加進 CommentsProvider union；
//   2. 自託管的話，照 GiscusConfig 的樣子加一個含 serverURL 的子設定型別；
//   3. 在 src/components/ 加一支對應元件（照 GiscusComments.astro 的樣子）；
//   4. 到 Comments.astro 的 switch 補一個 case。
// 共用外殼、loading 旋鈕、View Transitions 重掛都 provider 無關，新 provider 白拿；
// 主題同步「盯 <html> class」那半也共用，各 provider 只實作自己收到 light/dark 後
// 怎麼反應。provider 是建置期設定，可多支元件並存、靠改 config 一行切換——
// 萬一 giscus 依賴的 GitHub 不穩，換自託管是局部小改、不是重寫。
// 刻意不預先寫沒在用的 provider，避免帶進無法驗證的死碼。

export type CommentsProvider = 'none' | 'giscus';

// 載入時機：
//   'eager' 一進頁面就載；
//   'lazy'  留言區快滑進視窗才載（IntersectionObserver）——預設，兼顧效能與零點擊摩擦；
//   'click' 讀者按按鈕才載，第三方接觸壓到最低。
export type CommentsLoading = 'eager' | 'lazy' | 'click';

// Giscus 子設定。值到 https://giscus.app 設定後取得（皆非機密，可進 repo）。
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
