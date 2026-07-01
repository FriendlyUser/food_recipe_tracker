import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { siteLocale } from '../i18n/ui';
import { getSortedPosts, postDescription } from '../lib/posts';

export async function GET(context) {
	// 依發布日新→舊輸出（原本未排序，是 glob 檔名序）
	const posts = await getSortedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/rss/styles.xsl',
		customData: `<language>${siteLocale.html}</language>`,
		items: posts.map((post) => ({
			...post.data,
			// 缺 frontmatter description 時，與頁面／JSON-LD 一致地用內文摘要 fallback
			description: postDescription(post),
			link: `/blog/${post.id}/`,
		})),
	});
}
