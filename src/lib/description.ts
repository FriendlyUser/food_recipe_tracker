// 從文章 body 萃取純文字。剝除 markdown 標記後得到可讀純文字，三處共用同一套剝法：
//   - descriptionFromBody（截 160 字當 meta / RSS / JSON-LD / 文章卡片的 description fallback）
//   - reading-time（去掉非內文符號後計字數）
//   - llms.txt（站台導覽摘要，走 descriptionFromBody）
// 改剝除規則只動這裡。符號一律換空白（不含 - 以保留 Wi-Fi 等複合詞）；inline code 與 HTML
// 標籤連內容一併剝掉（摘要與字數都不該含指令碼／標記）。
export function stripMarkdown(body: string): string {
  return body
    .replace(/^---[\s\S]*?---/, '')            // frontmatter
    .replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, '') // fenced code block（先剝，免得摘要／字數含指令碼）
    .replace(/`[^`]*`/g, '')                   // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')           // 圖片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 連結只留文字
    .replace(/<[^>]+>/g, ' ')                  // HTML 標籤
    .replace(/#{1,6}\s+/g, '')                 // 標題符號
    .replace(/[*_~>|]/g, ' ')                  // 其餘強調／引用符號 → 空白
    .replace(/\s+/g, ' ')
    .trim();
}

// 缺 frontmatter description 時的 fallback：剝成純文字後截前 160 字。
// 頁面 <meta>、JSON-LD、RSS、文章卡片與 llms.txt 共用，確保各處摘要一致。
export function descriptionFromBody(body: string): string {
  const text = stripMarkdown(body);
  return text.length > 160 ? text.slice(0, 157) + '…' : text;
}
