// RSS feed 的 XSL 樣式表（i18n-aware）。
// 當使用者用瀏覽器直接打開 /rss.xml 時，這張樣式表把原始 XML 轉成可讀頁面。
// 介面字串走 src/i18n/utils 的字典；動態內容（標題、描述、文章）由 XSL 從 RSS XML 取。
import type { APIRoute } from 'astro';
import { useTranslations } from '../../i18n/utils';
import { siteLocale } from '../../i18n/ui';

export const GET: APIRoute = () => {
  const t = useTranslations();

  const xsl = `<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="${siteLocale.html}">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS</title>
        <style>
          :root {
            --bg: #f7fbfd;
            --card: #ffffff;
            --text: #1a2730;
            --muted: #5b6b75;
            --accent: #0a8cbf;
            --accent-dark: #086a91;
            --border: #d8e6ee;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0d1620;
              --card: #14222e;
              --text: #e6eef3;
              --muted: #97a6b0;
              --accent: #4fc3e8;
              --accent-dark: #8bd6f0;
              --border: #243643;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, "Segoe UI", "Noto Sans TC", system-ui, sans-serif;
            line-height: 1.6;
          }
          main { max-width: 720px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
          .feed-head {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.75rem 1.75rem 2rem;
            margin-bottom: 2.5rem;
          }
          .badge {
            display: inline-block;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #fff;
            background: #086a91; /* 固定深底，白字在明暗兩模式都達 WCAG（不跟 --accent 翻亮）*/
            padding: 0.2em 0.7em;
            border-radius: 999px;
            margin: 0 0 0.9rem;
          }
          h1 { font-size: 1.75rem; margin: 0 0 0.6rem; line-height: 1.3; }
          .channel-desc { color: var(--muted); margin: 0 0 1.1rem; }
          .hint {
            font-size: 0.88rem;
            color: var(--muted);
            background: color-mix(in srgb, var(--accent) 9%, transparent);
            border-left: 3px solid var(--accent);
            padding: 0.7rem 0.95rem;
            border-radius: 0 8px 8px 0;
            margin: 0 0 1.25rem;
          }
          .site-link {
            display: inline-block;
            color: var(--accent-dark);
            font-weight: 600;
            text-decoration: none;
          }
          .site-link:hover { text-decoration: underline; }
          h2 {
            font-size: 1.1rem;
            margin: 0 0 1.1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--border);
          }
          ul.items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
          .item {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.1rem 1.25rem;
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }
          .item:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10,140,191,0.12); }
          .item-link {
            font-size: 1.08rem;
            font-weight: 700;
            color: var(--text);
            text-decoration: none;
          }
          .item-link:hover { color: var(--accent-dark); }
          .item-date { font-size: 0.8rem; color: var(--muted); margin: 0.35rem 0 0.6rem; }
          .item-desc { color: var(--muted); margin: 0 0 0.85rem; font-size: 0.92rem; }
          .read-more { font-size: 0.85rem; font-weight: 600; color: var(--accent-dark); text-decoration: none; }
          .read-more:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <main>
          <header class="feed-head">
            <p class="badge">${t('rss.badge')}</p>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="channel-desc"><xsl:value-of select="/rss/channel/description"/></p>
            <p class="hint">${t('rss.subscribeHint')}</p>
            <a class="site-link" href="{/rss/channel/link}">${t('rss.visitSite')}</a>
          </header>

          <h2>${t('rss.latestPosts')}</h2>
          <ul class="items">
            <xsl:for-each select="/rss/channel/item">
              <li class="item">
                <a class="item-link" href="{link}"><xsl:value-of select="title"/></a>
                <p class="item-date"><xsl:value-of select="substring(pubDate, 1, 16)"/></p>
                <p class="item-desc"><xsl:value-of select="description"/></p>
                <a class="read-more" href="{link}">${t('rss.readMore')}</a>
              </li>
            </xsl:for-each>
          </ul>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

  return new Response(xsl, {
    headers: { 'Content-Type': 'text/xsl; charset=utf-8' },
  });
};
