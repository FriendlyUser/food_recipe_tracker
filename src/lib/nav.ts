// Header 導覽連結的 active 判定：href 與路徑完全相等，或第一段路徑相同
// （如 /blog/some-post/ 仍點亮 /blog）。
// 兩個使用點必須同一份邏輯：HeaderLink.astro（建置期渲染 class）與
// Header.astro 的 after-swap script（Header 被 transition:persist 保留，
// ClientRouter 換頁時要手動同步 active class）。
export function isNavActive(href: string, pathname: string): boolean {
  const firstSegment = pathname.match(/[^/]+/g)?.[0] ?? '';
  return href === pathname || href === '/' + firstSegment;
}
