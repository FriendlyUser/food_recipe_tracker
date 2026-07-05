// 系列文的 schema 與邏輯。實際內容資料在 src/data/series.ts。
import { seriesData } from '../data/series';

// heroImage 驗證用：series 卡背圖的合法 glob key 集合。
// pattern 必須與 SeriesCard.astro 的 import.meta.glob 完全一致（那邊才是真正取圖的地方）；
// 這裡不 eager、只要 key，建置期比對用。
const seriesImageKeys = new Set(
  Object.keys(import.meta.glob('/src/assets/series/*.{webp,jpg,jpeg,png,avif}')),
);

export type Chapter = {
  slug: string;    // 對應 blog post 的檔名（不含副檔名）
  title?: string;  // 省略時使用 post 的 title
};

export type Part = {
  title: string;
  chapters: Chapter[];
};

export type SeriesEntry = {
  title: string;
  description?: string;
  heroImage?: string;    // src/assets/series/ 下的 glob key，e.g. '/src/assets/series/linux.webp'（走 Astro 圖片優化）
  heroDarkness?: number; // 0–1，預設 0.5
  featured?: boolean;    // true 表示在首頁精選系列顯示
  parts: Part[];
};

export type Domain = {
  title: string;
  heroImage?: string;    // src/assets/series/ 下的 glob key，e.g. '/src/assets/series/linux.webp'（走 Astro 圖片優化）
  heroDarkness?: number; // 0–1，預設 0.5
  series: Record<string, SeriesEntry>; // key＝URL slug（小寫英數連字號）
};

export type SeriesData = Record<string, Domain>; // key＝URL slug（小寫英數連字號）

// 建置期驗證（series/[domain]/[series].astro 的 getStaticPaths 呼叫）：
// - domain / series key 直接成為 URL 段，必須是 URL-safe slug——
//   之前 'Blog and Author' 這種 key 會變成 /series/Blog%20and%20Author/，
//   且改顯示名＝斷鏈，所以 key 與 title 分離並在這裡把關。
// - chapter slug 打錯字沒有型別錯誤，只會默默顯示 slug 字串並連去 404，
//   故對照實際文章 id 檢查。錯誤一次列完、直接 fail build。
// - heroImage 打錯字同樣沒有型別錯誤，SeriesCard 只會默默 fallback 成漸層底，
//   故對照 src/assets/series/ 的實際檔案檢查，與 chapter slug 同一套把關。
export function validateSeriesData(postIds: Set<string>): void {
  const errors: string[] = [];
  const isSlug = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
  const checkHeroImage = (heroImage: string | undefined, owner: string) => {
    if (heroImage && !seriesImageKeys.has(heroImage)) {
      errors.push(`${owner} 的 heroImage "${heroImage}" 在 src/assets/series/ 找不到對應檔案`);
    }
  };

  for (const [domainKey, domain] of Object.entries(seriesData)) {
    if (!isSlug(domainKey)) {
      errors.push(`domain key "${domainKey}" 不是 URL-safe slug（小寫英數與連字號）`);
    }
    checkHeroImage(domain.heroImage, `domain「${domain.title}」`);
    for (const [seriesKey, series] of Object.entries(domain.series)) {
      if (!isSlug(seriesKey)) {
        errors.push(`series key "${seriesKey}"（${series.title}）不是 URL-safe slug（小寫英數與連字號）`);
      }
      checkHeroImage(series.heroImage, `系列「${series.title}」`);
      for (const part of series.parts) {
        for (const ch of part.chapters) {
          if (!postIds.has(ch.slug)) {
            errors.push(`系列「${series.title}」/「${part.title}」的章節 slug "${ch.slug}" 找不到對應文章`);
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`[series] 資料驗證失敗：\n- ${errors.join('\n- ')}`);
  }
}

// 在系列中找到某篇文章的位置，回傳前後章節資訊，找不到回傳 null
export type ChapterContext = {
  domainKey: string;
  domainTitle: string;
  seriesKey: string;
  series: SeriesEntry;
  part: Part;
  chapter: Chapter;
  prev: (Chapter & { partTitle: string }) | null;
  next: (Chapter & { partTitle: string }) | null;
};

export function getChapterContext(slug: string): ChapterContext | null {
  for (const [domainKey, domain] of Object.entries(seriesData)) {
    for (const [seriesKey, series] of Object.entries(domain.series)) {
      // 把所有章節攤平，方便計算前後
      const flat: Array<{ chapter: Chapter; partTitle: string }> = [];
      for (const part of series.parts) {
        for (const chapter of part.chapters) {
          flat.push({ chapter, partTitle: part.title });
        }
      }

      const idx = flat.findIndex((c) => c.chapter.slug === slug);
      if (idx === -1) continue;

      const currentPart = series.parts.find((p) =>
        p.chapters.some((c) => c.slug === slug)
      )!;

      return {
        domainKey,
        domainTitle: domain.title,
        seriesKey,
        series,
        part: currentPart,
        chapter: flat[idx].chapter,
        prev: idx > 0 ? { ...flat[idx - 1].chapter, partTitle: flat[idx - 1].partTitle } : null,
        next: idx < flat.length - 1 ? { ...flat[idx + 1].chapter, partTitle: flat[idx + 1].partTitle } : null,
      };
    }
  }
  return null;
}
