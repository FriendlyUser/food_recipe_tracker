import type { APIRoute } from 'astro';

// 動態產生 robots.txt：sitemap 網址直接取自 astro.config.mjs 的 `site`，
// 不寫死網域，換站時不用改這裡。
//
// 全站開放爬取：Tags 分頁雖然「不索引」，但那是用各頁 meta 的 noindex,follow
// 控制的；這裡刻意不 Disallow，否則爬蟲連進去 follow 文章連結都被擋掉。
//
// AI 爬蟲政策：全部開放。不額外列 GPTBot / ClaudeBot / CCBot 等 AI bot，
// 一律沿用 `User-agent: *` 的 Allow: /，歡迎被 AI 收錄與引用（刻意決定，非遺漏）。
//
// Content Signals（contentsignals.org / Cloudflare 推動的 robots.txt 內容用途宣告）：
// 三項偏好全設 yes，與上述全開政策一致——
//   search    = 可建索引、提供搜尋結果
//   ai-input  = 可即時檢索餵入 AI（RAG／grounding／生成式搜尋答案）
//   ai-train  = 可用於訓練／微調模型
// 註：這是偏好宣告，非技術性封鎖；不守規矩的爬蟲仍可能忽略。
const robotsTxt = (sitemapURL: URL) => `\
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site);
	return new Response(robotsTxt(sitemapURL), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
