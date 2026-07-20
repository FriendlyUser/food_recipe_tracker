import type { APIRoute } from 'astro';

// 動態產生 robots.txt：sitemap 網址直接取自 astro.config.mjs 的 `site`，
// 不寫死網域，換站時不用改這裡。
//
// 全站開放爬取：Tags 分頁雖然「不索引」，但那是用各頁 meta 的 noindex,follow
// 控制的；這裡刻意不 Disallow，否則爬蟲連進去 follow 文章連結都被擋掉。
//
// Content Signals 預設：擋訓練、留檢索——
//   search=yes    可建索引、提供搜尋結果
//   ai-input=yes  可即時檢索餵入 AI（RAG／grounding），讓你的文章能被附連結引用
//   ai-train=no   不可用於訓練／微調模型
// 這是偏好宣告而非技術封鎖，且刻意不列具名 AI bot 的 Disallow（名單會過期）。
// 三項旗標的取捨與改法見 docs/zh-Hant/seo-and-crawlers.md。
const robotsTxt = (sitemapURL: URL) => `\
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);
	return new Response(robotsTxt(sitemapURL), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
