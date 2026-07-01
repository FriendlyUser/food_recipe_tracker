import type { APIRoute } from 'astro';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { seriesData } from '../data/series';
import { getSortedPosts, postDescription } from '../lib/posts';

// 動態產生 /llms.txt（llmstxt.org 規範）：給 AI agent 的網站導覽純文字檔，
// 從 blog collection 與 series 資料自動同步，不需手動維護清單。
// 文章排序與「有效描述」走 lib/posts 的 getSortedPosts／postDescription，與其餘頁面同源。

export const GET: APIRoute = async ({ site }) => {
	const abs = (path: string) => new URL(path, site).href;

	const posts = await getSortedPosts();

	const postLines = posts.map((post) => {
		const desc = postDescription(post);
		const url = abs(`/blog/${post.id}/`);
		return desc
			? `- [${post.data.title}](${url}): ${desc}`
			: `- [${post.data.title}](${url})`;
	});

	const seriesLines = Object.entries(seriesData).flatMap(([domainKey, domain]) =>
		Object.entries(domain.series).map(([seriesKey, series]) => {
			const url = abs(`/series/${domainKey}/${seriesKey}/`);
			return series.description
				? `- [${series.title}](${url}): ${series.description}`
				: `- [${series.title}](${url})`;
		}),
	);

	const body = `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}

本站由 ${SITE_AUTHOR} 經營。

## 文章

${postLines.join('\n')}

## 系列

${seriesLines.join('\n')}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
