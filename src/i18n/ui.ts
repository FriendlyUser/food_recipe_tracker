// UI 字串集中地（i18n-ready）。
// 這裡只放「介面字串」——導覽、按鈕、區塊標題、計數模板、meta 標題等；
// 長文內容（about 自介、首頁 hero 段落、文章本文）仍留在各自頁面/內容集合，不進這裡。
//
// 設計成「以語言為外層、扁平 key 為內層」，日後要加語言只需補一個鍵：
//   export const ui = { 'zh-hant': {...}, 'en': {...} }
// 取值與插值統一走 src/i18n/utils.ts 的 useTranslations()。
// 模板插值用 {name} 佔位（注意 Pagefind 自己的 [COUNT] / [SEARCH_TERM] 不是我們的佔位，原樣保留）。

export const defaultLang = 'en' as const;

export const ui = {
  'zh-hant': {
    // ── 導覽列（Header）──
    'nav.blog': 'Blog',
    'nav.tags': 'Tags',
    'nav.series': 'Series',
    'nav.blogroll': 'Blogroll',
    'nav.about': 'About',
    'nav.menu': '選單',

    // ── 全站搜索（Header / Pagefind）──
    'search.label': '搜索',
    'search.placeholder': '搜索文章…',
    'search.zeroResults': '找不到相關結果',
    'search.manyResults': '找到 [COUNT] 個「[SEARCH_TERM]」的相關結果',
    'search.oneResult': '找到 [COUNT] 個「[SEARCH_TERM]」的相關結果',
    'search.loadMore': '載入更多結果',
    'search.searching': '搜尋中…',
    'search.devNotice': '搜索功能在 <code>pnpm build</code> 後可用',

    // ── 主題切換 ──
    'theme.toggle': '切換主題',

    // ── 頁尾 ──
    // 作者名與授權代碼不寫死在這（屬站台身分，非可翻譯介面字串）——由 Footer 從 consts 注入 {author}/{license}。
    'footer.copyright': '© {year} {author}. {license}.',
    'footer.rssLabel': '訂閱 RSS',

    // ── 內容授權（在地化呈現）──
    // 預設「保留所有權利」(All rights reserved)：授權代碼在 consts.CONTENT_LICENSE。
    // 下面三個值只有在設了 CC 之類的授權時才用到：license.url 非空時，about 頁會把
    // license.fullName 渲染成連到該 deed 的連結、並接上 license.contact 聯絡條款；
    // 預設留空 → about 頁只顯示「© 作者. All rights reserved.」。
    'license.fullName': 'All rights reserved',
    'license.url': '',
    'license.contact': '',
    // 改用 CC BY-NC-ND 4.0 的範例（把上面三行換成這組，並把 consts.CONTENT_LICENSE 設成對應代碼）：
    //   'license.fullName': 'CC BY-NC-ND 4.0 姓名標示─非商業性─禁止改作 4.0 國際',
    //   'license.url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hant',
    //   'license.contact': '如果需要商業使用、改寫或翻譯請聯絡告知。',

    // ── 分頁 ──
    'pagination.nav': '文章分頁',
    'pagination.prev': '上一頁',
    'pagination.next': '下一頁',

    // ── 文章頁（BlogPost）──
    'post.toc': '目錄',
    'post.openToc': '開啟目錄',
    'post.closeToc': '關閉目錄',
    'post.related': '相似文章',
    'post.lastUpdated': '最後更新於',
    'post.readingTime': '約 {n} 分鐘閱讀',
    'post.belongsTo': '本文屬於：',
    'post.prev': '← 上一篇',
    'post.next': '下一篇 →',
    'post.copyCode': '複製程式碼',
    'post.imageZoom': '圖片放大',
    'post.seriesNav': '系列文章導覽',
    'breadcrumb.home': '首頁',
    'breadcrumb.blog': '文章',

    // ── 留言板（Comments）──
    'comments.title': '留言',
    'comments.load': '載入留言',

    // ── 文章列表（blog index / page）──
    'blog.allPosts': '全部文章',
    'blog.metaDescription': '所有文章列表',
    'blog.totalCount': '共 {n} 篇',
    'blog.pageInfo': '共 {total} 篇 · 第 {current} / {last} 頁',
    'blog.pageTitle': '全部文章 第 {n} 頁',

    // ── 標籤（tags index / [...path]）──
    'tags.title': '標籤',
    'tags.metaDescription': '所有文章標籤',
    'tags.viewAll': '查看全部',
    'tags.sectionCount': '{n} 篇',
    'tags.postCount': '{n} 篇文章',
    'tags.leafDescription': '標記為「{name}」的文章',
    'tags.groupDescription': '「{name}」分類下的文章',
    'tags.empty': '這個標籤目前還沒有文章。',
    'tags.orphanTitle': '未分類',
    'tags.orphanHint': '尚未收進分類樹的標籤',
    'tags.planned': '規劃中',

    // ── Blogroll（顯示名「友站」）──
    'blogroll.title': '友站',
    'blogroll.metaDescription': '這個 Blog 的友站連結',
    'blogroll.intro': '網路上值得一逛的好地方。',
    'blogroll.empty': '目前還沒有友站，敬請期待 ✨',

    // ── 系列文 ──
    'series.title': '系列文',
    'series.metaDescription': '依主題整理的系列文章',
    'series.empty': '系列文章即將推出。',
    'series.domainMetaDescription': '{title} 系列文章',
    'series.detailMetaDescription': '{title} 系列文章目錄',
    'series.seriesCount': '{n} 個系列',
    'series.chapterCount': '{n} 篇文章',
    'series.partCount': '{n} 個 Part',
    'series.partAndChapters': '{parts} 個 Part・{chapters} 篇文章',

    // ── 首頁區塊（index）──
    'home.pinned': '置頂文章',
    'home.pinnedBadge': '置頂',
    'home.featuredSeries': '精選系列',
    'home.seeAllSeries': '查看全部系列 →',
    'home.latestPosts': '最新文章',

    // ── 關於（about，僅 meta；自介本文留在頁面）──
    'about.title': '關於我',
    'about.metaDescription': '關於這個Blog和作者',

    // ── 404 找不到頁面 ──
    'notFound.metaTitle': '404 — 找不到頁面',
    'notFound.metaDescription': '這個頁面不存在或已被移動。',
    'notFound.heading': '這個頁面不存在',
    'notFound.message': '你要找的頁面可能被移動、改名，或從來就不存在。確認一下網址，或從下面的入口重新出發。',
    'notFound.home': '← 回到首頁',
    'notFound.linksLabel': '或前往',

    // ── RSS 樣式表（瀏覽器直接打開 feed 時的可讀頁面）──
    'rss.badge': 'RSS Feed',
    'rss.subscribeHint': '這是一個 RSS 訂閱來源。把這個頁面的網址貼進你的 RSS 閱讀器，就能在有新文章時自動收到通知。',
    'rss.visitSite': '造訪網站 →',
    'rss.latestPosts': '最新文章',
    'rss.readMore': '閱讀全文 →',

    // ── llms.txt（給 AI agent 的網站導覽純文字檔）──
    'llms.operatedBy': '本站由 {author} 經營。',
    'llms.postsHeading': '文章',
    'llms.seriesHeading': '系列',
  },
  'en': {
    // ── Navigation Bar (Header) ──
    'nav.blog': 'Blog',
    'nav.tags': 'Tags',
    'nav.series': 'Series',
    'nav.blogroll': 'Blogroll',
    'nav.about': 'About',
    'nav.menu': 'Menu',

    // ── Site Search (Header / Pagefind) ──
    'search.label': 'Search',
    'search.placeholder': 'Search posts…',
    'search.zeroResults': 'No results found',
    'search.manyResults': 'Found [COUNT] results for "[SEARCH_TERM]"',
    'search.oneResult': 'Found [COUNT] result for "[SEARCH_TERM]"',
    'search.loadMore': 'Load more results',
    'search.searching': 'Searching…',
    'search.devNotice': 'Search feature is available after <code>pnpm build</code>',

    // ── Theme Toggle ──
    'theme.toggle': 'Toggle theme',

    // ── Footer ──
    // Author name and license code are not hardcoded here (they belong to site identity, not translatable UI strings) — injected into Footer from consts via {author}/{license}.
    'footer.copyright': '© {year} {author}. {license}.',
    'footer.rssLabel': 'Subscribe to RSS',

    // ── Content License (Localized presentation) ──
    // Default: "All rights reserved": License code is in consts.CONTENT_LICENSE.
    // The following three values are only used when a CC-like license is set: when license.url is not empty, the About page will render
    // license.fullName as a link pointing to that deed, appended with license.contact terms;
    // Defaults to empty → About page only displays "© Author. All rights reserved.".
    'license.fullName': 'All rights reserved',
    'license.url': '',
    'license.contact': '',
    // Example for switching to CC BY-NC-ND 4.0 (replace the three lines above with this set and set consts.CONTENT_LICENSE to the corresponding code):
    //   'license.fullName': 'CC BY-NC-ND 4.0 Attribution-NonCommercial-NoDerivatives 4.0 International',
    //   'license.url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    //   'license.contact': 'Please reach out if you need commercial use, adaptation, or translation.',

    // ── Pagination ──
    'pagination.nav': 'Post Pagination',
    'pagination.prev': 'Previous',
    'pagination.next': 'Next',

    // ── Blog Post Page (BlogPost) ──
    'post.toc': 'Table of Contents',
    'post.openToc': 'Open Table of Contents',
    'post.closeToc': 'Close Table of Contents',
    'post.related': 'Related Posts',
    'post.lastUpdated': 'Last updated on',
    'post.readingTime': '{n} min read',
    'post.belongsTo': 'This post belongs to:',
    'post.prev': '← Previous Post',
    'post.next': 'Next Post →',
    'post.copyCode': 'Copy Code',
    'post.imageZoom': 'Zoom Image',
    'post.seriesNav': 'Series Navigation',
    'breadcrumb.home': 'Home',
    'breadcrumb.blog': 'Posts',

    // ── Comments ──
    'comments.title': 'Comments',
    'comments.load': 'Load Comments',

    // ── Post List (blog index / page) ──
    'blog.allPosts': 'All Posts',
    'blog.metaDescription': 'List of all posts',
    'blog.totalCount': '{n} posts total',
    'blog.pageInfo': '{total} posts in total · Page {current} of {last}',
    'blog.pageTitle': 'All Posts - Page {n}',

    // ── Tags (tags index / [...path]) ──
    'tags.title': 'Tags',
    'tags.metaDescription': 'All post tags',
    'tags.viewAll': 'View All',
    'tags.sectionCount': '{n} posts',
    'tags.postCount': '{n} posts',
    'tags.leafDescription': 'Posts tagged with "{name}"',
    'tags.groupDescription': 'Posts under the "{name}" category',
    'tags.empty': 'There are no posts for this tag yet.',
    'tags.orphanTitle': 'Uncategorized',
    'tags.orphanHint': 'Tags not yet categorized in the taxonomy tree',
    'tags.planned': 'Planned',

    // ── Blogroll (Display name "Links") ──
    'blogroll.title': 'Blogroll',
    'blogroll.metaDescription': 'Links to friendly blogs and websites',
    'blogroll.intro': 'Great places worth visiting across the web.',
    'blogroll.empty': 'No links added yet. Stay tuned! ✨',

    // ── Series ──
    'series.title': 'Series',
    'series.metaDescription': 'Post series organized by topic',
    'series.empty': 'Series coming soon.',
    'series.domainMetaDescription': '{title} Series',
    'series.detailMetaDescription': '{title} Series Directory',
    'series.seriesCount': '{n} series',
    'series.chapterCount': '{n} posts',
    'series.partCount': '{n} parts',
    'series.partAndChapters': '{parts} parts · {chapters} posts',

    // ── Home Page Sections (index) ──
    'home.pinned': 'Pinned Posts',
    'home.pinnedBadge': 'Pinned',
    'home.featuredSeries': 'Featured Series',
    'home.seeAllSeries': 'View All Series →',
    'home.latestPosts': 'Latest Posts',

    // ── About (about, meta only; bio content stays in the page template) ──
    'about.title': 'About Me',
    'about.metaDescription': 'About this blog and the author',

    // ── 404 Page Not Found ──
    'notFound.metaTitle': '404 — Page Not Found',
    'notFound.metaDescription': 'This page does not exist or has been moved.',
    'notFound.heading': 'This Page Does Not Exist',
    'notFound.message': 'The page you are looking for might have been moved, renamed, or never existed. Check the URL or start over from the links below.',
    'notFound.home': '← Back to Home',
    'notFound.linksLabel': 'Or visit',

    // ── RSS Stylesheet (Readable page when viewing feed directly in browser) ──
    'rss.badge': 'RSS Feed',
    'rss.subscribeHint': 'This is an RSS feed. Copy and paste this URL into your RSS reader to automatically get updates when new posts are published.',
    'rss.visitSite': 'Visit Website →',
    'rss.latestPosts': 'Latest Posts',
    'rss.readMore': 'Read More →',

    // ── llms.txt (Text site navigation guide for AI agents) ──
    'llms.operatedBy': 'This site is operated by {author}.',
    'llms.postsHeading': 'Posts',
    'llms.seriesHeading': 'Series',
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)[typeof defaultLang];

// 全站 locale 的單一真相來源。一個語言在不同情境需要不同的標籤形式：
//   html   — <html lang> / JSON-LD inLanguage / RSS <language>（BCP-47，如 zh-Hant）
//   og     — og:locale（底線分隔、含地區，如 zh_TW）
//   intl   — Intl／toLocaleDateString 的 locale（日期格式化）
//   giscus — giscus client 的 data-lang（其支援的語言碼，如 zh-TW；與 og 同語言、寫法不同）
// 單語言時全站只引用下面的 siteLocale；日後加語言時，各語言在這裡補一筆即可。
export const localeTags = {
  'zh-hant': { html: 'zh-Hant', og: 'zh_TW', intl: 'zh-Hant', giscus: 'zh-TW' },
  'en': { html: 'en', og: 'en_US', intl: 'en', giscus: 'en' }
} as const satisfies Record<Lang, { html: string; og: string; intl: string; giscus: string }>;

// 目前單語言：直接解析成預設語言的標籤組。
export const siteLocale = localeTags[defaultLang];
