import type { APIRoute } from 'astro';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { seriesData } from '../data/series';
import { getSortedPosts, postDescription } from '../lib/posts';
import { useTranslations } from '../i18n/utils';

// 動態產生 /llms.txt（llmstxt.org 規範）：給 AI agent 的網站導覽純文字檔，
// 從 blog collection 與 series 資料自動同步，不需手動維護清單。
// 文章排序與「有效描述」走 lib/posts 的 getSortedPosts／postDescription，與其餘頁面同源；
// 標題與句子走 i18n/ui.ts 的 llms.* key，換站台語系時不會漏掉這一頁。

export const GET: APIRoute = async ({ site }) => {
	const t = useTranslations();
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

${t('llms.operatedBy', { author: SITE_AUTHOR })}

## ${t('llms.postsHeading')}

${postLines.join('\n')}

## ${t('llms.seriesHeading')}

${seriesLines.join('\n')}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
