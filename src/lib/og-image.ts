// 社群分享圖（og:image / twitter:image / JSON-LD image）的統一出口。
// 這些 URL 是給社群平台的爬蟲直接抓的，不能用 ImageMetadata.src——那指向
// Astro 發出的「原始檔」（fallback hero 原圖 3.5MB），LINE / Discord 等平台
// 抓大圖會很慢甚至逾時放棄預覽。這裡統一縮壓成 1200×630（OG 建議比例）。
// 選 JPEG 而非 WebP 是相容性考量：部分平台爬蟲（尤其通訊軟體）不吃 WebP。
// BaseHead 與 BlogPost（JSON-LD）共用，同參數的轉換 Astro 會去重、只產一張。
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export async function toShareImage(src: ImageMetadata): Promise<string> {
  const img = await getImage({
    src,
    width: 1200,
    height: 630,
    fit: 'cover',
    format: 'jpeg',
    quality: 80,
  });
  return img.src;
}
