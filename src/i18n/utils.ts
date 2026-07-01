// i18n 取值與插值工具。辭典本體在 src/i18n/ui.ts。
//
// 用法（頁面 frontmatter 或元件）：
//   import { useTranslations } from '../i18n/utils';
//   const t = useTranslations();          // 目前單語言，預設 zh-hant
//   t('nav.blog')                          // → 'Blog'
//   t('tags.sectionCount', { n: 5 })       // → '5 篇'
//
// 日後加語言時，把頁面當前 lang 傳進 useTranslations(lang) 即可，缺漏的 key 會 fallback 回 defaultLang。
import { ui, defaultLang, type Lang, type UIKey } from './ui';

export function useTranslations(lang: Lang = defaultLang) {
  const dict = ui[lang] as Record<UIKey, string>;
  const base = ui[defaultLang] as Record<UIKey, string>;
  return function t(key: UIKey, params?: Record<string, string | number>): string {
    let str = dict[key] ?? base[key];
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, String(v));
      }
    }
    return str;
  };
}
