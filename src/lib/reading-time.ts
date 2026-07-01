// 估算閱讀時間（分鐘）。中文無空白、按「字數」計；英數按「詞數」計，兩者加總。
// 至少 1 分鐘。內文剝法（去 code block / inline code / 圖片 / 連結 URL / HTML / markdown
// 符號）與 description.ts 共用 stripMarkdown，避免把指令碼、網址、標記符號算進去而高估。
//
// 兩個速率的「單位不同」，不能直接比快慢：
//   CJK_RATE = 350「字元」/分；WORD_RATE = 200「詞」/分（一個英文詞≈5–6 字母）。
// 換算同單位後英文其實更快，但中文單字資訊密度高，讀完同等內容的時間其實接近。
//
// 這兩個值不是從某資料集算出的平均/中位數，而是業界慣用的整數約定值，對齊閱讀研究
// 均值再保守取整：
//   - 英文 200 wpm 是 reading-time 類工具的事實標準預設；研究上靜默閱讀非小說的平均
//     約 238 wpm（Brysbaert 2019 meta 分析），200 是向下取整的保守值。
//   - 中文常見引用 ~300–400 字/分，取偏中間略保守的 350。
// 個體差異大，閱讀時間本就是估計值、非量測值，整數約定夠用又好維護。
import { stripMarkdown } from './description';

const CJK_RATE = 350; // 字元 / 分
const WORD_RATE = 200; // 詞 / 分

// 中日韓統一表意文字 + 相容表意文字 + 日文假名（本站以中文為主，含少量日文）
const CJK = /[㐀-鿿豈-﫿぀-ヿ]/g;

export function readingTimeMinutes(body: string): number {
  const text = stripMarkdown(body); // 與 description 共用剝法

  const cjkCount = (text.match(CJK) ?? []).length;
  // 去掉 CJK 字後，剩下以空白切詞計英數詞數
  const wordCount = (text.replace(CJK, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;

  const minutes = cjkCount / CJK_RATE + wordCount / WORD_RATE;
  return Math.max(1, Math.round(minutes));
}
