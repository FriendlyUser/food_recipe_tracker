// 標籤分類（taxonomy）的 schema 與邏輯。實際內容資料在 src/data/taxonomy.ts。
import { taxonomy } from '../data/taxonomy';

export type TaxonomyNode = {
  defaultOpen?: boolean;
  tags?: string[]; // 直屬這層的葉節點 tag
  groups?: Record<string, TaxonomyNode>; // 子群組
};

export type Taxonomy = Record<string, TaxonomyNode>;

// 遞迴取得某節點底下所有葉節點 tag 與子群組名稱。
// 群組名稱也視為「隱含 tag」：文章直接掛群組名（如 "Windows"）代表
// 「直屬該群組、尚未細分」，群組頁與計數都要收納。
export function getAllLeafTags(node: TaxonomyNode): string[] {
  const tags: string[] = [...(node.tags ?? [])];
  for (const [childName, child] of Object.entries(node.groups ?? {})) {
    tags.push(childName, ...getAllLeafTags(child));
  }
  return tags;
}

// 取得 taxonomy 裡所有群組名稱（含巢狀）的 Set。僅同檔 getOrphanTags 內部使用，故不對外匯出。
function getAllGroupNames(): Set<string> {
  const names = new Set<string>();
  function walk(groups: Record<string, TaxonomyNode> | undefined) {
    for (const [name, node] of Object.entries(groups ?? {})) {
      names.add(name);
      walk(node.groups);
    }
  }
  walk(taxonomy);
  return names;
}

// tag 名稱 → URL slug。
// 空白、斜線與其他標點一律收斂成連字號（字母／數字含 CJK 保留），
// 維持「一個名稱＝一段 URL」：toSlug("KVM/QEMU") === "kvm-qemu"、
// toSlug("磁碟管理(mmc)") === "磁碟管理-mmc"。
// 注意：改這條規則＝改全站 tag URL，舊路徑要在 astro.config.mjs 的 redirects 補轉址。
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// 孤兒 tag＝不在 taxonomy（既非葉 tag、也非群組名＝隱含 tag）的文章 tag。
// tags 樹頁的「未分類」區塊與 [...path].astro 的自動生成葉頁共用這個定義。
export function getOrphanTags(allTags: Iterable<string>): string[] {
  const taxonomyTags = getAllTaxonomyTags();
  const groupNames = getAllGroupNames();
  return [...allTags].filter(t => !taxonomyTags.has(t) && !groupNames.has(t));
}

// 取得 taxonomy 裡所有葉節點 tag 的 Set
export function getAllTaxonomyTags(): Set<string> {
  const all = new Set<string>();
  function walk(node: TaxonomyNode) {
    for (const tag of node.tags ?? []) all.add(tag);
    for (const child of Object.values(node.groups ?? {})) walk(child);
  }
  for (const node of Object.values(taxonomy)) walk(node);
  return all;
}
