// 留言板共用瀏覽器端工具（provider 無關）。
// - whenReady：依載入策略決定「何時」觸發掛載（eager / lazy / click）。
// - watchTheme：盯 <html> 的 .dark/.light（主題切換唯一來源），變了才回報。
// 任何 provider（Giscus、未來的 Waline 等）都共用這兩塊；各自只實作
// 「掛載什麼」與「收到 light/dark 後怎麼反應」。

export type CommentsLoading = 'eager' | 'lazy' | 'click';

export function resolveTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// 盯 <html> 的 class 變化，主題真的變了才回呼。回傳取消訂閱函式（換頁前拆掉）。
export function watchTheme(onChange: (theme: 'light' | 'dark') => void): () => void {
  let last = resolveTheme();
  const mo = new MutationObserver(() => {
    const cur = resolveTheme();
    if (cur !== last) {
      last = cur;
      onChange(cur);
    }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}

type WhenReadyOpts = {
  target: Element; // lazy：觀察這個元素進視窗
  trigger?: HTMLElement | null; // click：按這個才載
  load: () => void; // 真正掛載的動作（只會被觸發一次）
};

// 依策略決定何時呼叫 load()。回傳清理函式，供 View Transitions 換頁前拆掉觀察/監聽。
export function whenReady(
  strategy: CommentsLoading,
  { target, trigger, load }: WhenReadyOpts,
): () => void {
  if (strategy === 'eager') {
    load();
    return () => {};
  }

  if (strategy === 'click') {
    const handler = () => load();
    trigger?.addEventListener('click', handler, { once: true });
    return () => trigger?.removeEventListener('click', handler);
  }

  // lazy：留言區快進視窗（提前 200px）才載，載完即停止觀察
  const io = new IntersectionObserver(
    entries => {
      if (entries.some(e => e.isIntersecting)) {
        io.disconnect();
        load();
      }
    },
    { rootMargin: '200px 0px' },
  );
  io.observe(target);
  return () => io.disconnect();
}
