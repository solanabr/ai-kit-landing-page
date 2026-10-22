// All client behaviour on the site: theme, tabs, copy buttons, mobile menu,
// the transcript reveal and catalog filtering. Content is in the static HTML;
// none of this renders any.

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel) as NodeListOf<T>);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- theme ----
for (const b of $$('[data-theme-toggle]')) {
  b.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('aikit-theme', t); } catch { /* private mode */ }
  });
}

// ---- mobile menu ----
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.getElementById('mobile-menu');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(open));
  if (menu) menu.hidden = !open;
  menuBtn.querySelector<HTMLElement>('[data-menu-closed]')!.hidden = open;
  menuBtn.querySelector<HTMLElement>('[data-menu-open]')!.hidden = !open;
});

// ---- language menus close on outside click and Escape ----
document.addEventListener('click', e => {
  for (const d of $$<HTMLDetailsElement>('details[data-close-outside][open]')) if (!d.contains(e.target as Node)) d.open = false;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') for (const d of $$<HTMLDetailsElement>('details[data-close-outside][open]')) { d.open = false; d.querySelector('summary')?.focus(); }
});

// ---- tabs: role=tablist inside [data-tabs]; arrow keys move between tabs ----
type TabChange = (index: number) => void;
const tabHooks = new WeakMap<Element, TabChange>();
function selectTab(root: Element, tabs: HTMLElement[], i: number, focus = false) {
  tabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls') || '');
    if (panel) panel.hidden = !on;
  });
  if (focus) tabs[i].focus();
  tabHooks.get(root)?.(i);
}
for (const root of $$('[data-tabs]')) {
  const tabs = $$<HTMLElement>(':scope [role="tab"]', root).filter(t => t.closest('[data-tabs]') === root);
  const vertical = root.querySelector('[role="tablist"]')?.getAttribute('aria-orientation') === 'vertical';
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(root, tabs, i));
    t.addEventListener('keydown', e => {
      const next = vertical ? 'ArrowDown' : 'ArrowRight';
      const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
      let j = -1;
      if (e.key === next) j = (i + 1) % tabs.length;
      else if (e.key === prev) j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j >= 0) { e.preventDefault(); selectTab(root, tabs, j, true); }
    });
  });
}

// ---- copy buttons ----
// A button copies its own data-copy-text, or else the visible tab panel of the
// [data-copy-scope] it sits in.
for (const b of $$<HTMLButtonElement>('[data-copy]')) {
  let timer = 0;
  b.addEventListener('click', async () => {
    let text = b.dataset.copyText;
    if (text == null) {
      const scope = b.closest('[data-copy-scope]');
      text = scope?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])')?.dataset.copyText ?? '';
    }
    try { await navigator.clipboard.writeText(text); } catch { return; }
    const status = b.querySelector<HTMLElement>('[data-copy-status]');
    b.classList.add('is-copied');
    if (status && b.dataset.copiedLabel) status.textContent = b.dataset.copiedLabel;
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      b.classList.remove('is-copied');
      if (status && b.dataset.copyLabel) status.textContent = b.dataset.copyLabel;
    }, 1800);
  });
}

// ---- transcript: type the command, then reveal lines one by one ----
for (const root of $$('[data-transcript]')) {
  let timer = 0;
  const play = () => {
    clearInterval(timer);
    const panel = root.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
    if (!panel) return;
    const cmd = panel.querySelector<HTMLElement>('[data-type]');
    const caret = panel.querySelector<HTMLElement>('[data-caret]');
    const lines = $$<HTMLElement>('[data-reveal]', panel);
    const full = cmd?.dataset.full ?? cmd?.textContent ?? '';
    if (cmd) cmd.dataset.full = full;
    if (reduceMotion()) {
      if (cmd) cmd.textContent = full;
      if (caret) caret.textContent = '';
      lines.forEach(l => l.classList.remove('pending'));
      return;
    }
    lines.forEach(l => l.classList.add('pending'));
    let typed = 0, shown = 0, tick = 0;
    if (cmd) cmd.textContent = '';
    if (caret) caret.textContent = '▍';
    timer = window.setInterval(() => {
      if (typed < full.length) { typed++; if (cmd) cmd.textContent = full.slice(0, typed); return; }
      if (caret) caret.textContent = '';
      if (shown < lines.length) { if (++tick % 12 === 0) lines[shown++].classList.remove('pending'); return; }
      clearInterval(timer);
    }, 32);
  };
  tabHooks.set(root, () => play());
  root.querySelector('[data-replay]')?.addEventListener('click', play);
  // Start when the transcript scrolls into view, so the reveal is seen.
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.3 });
  io.observe(root);
}

// ---- catalog filtering over the pre-rendered list ----
const cat = document.querySelector<HTMLElement>('[data-catalog]');
if (cat) {
  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get('q') || '',
    tags: (params.get('tags') || '').split(',').filter(Boolean),
    def: params.get('def') || 'all',
    view: params.get('view') || 'grid'
  };
  const search = cat.querySelector<HTMLInputElement>('[data-search-input]')!;
  const result = cat.querySelector<HTMLElement>('[data-result]')!;
  const empty = cat.querySelector<HTMLElement>('[data-empty]')!;
  const total = Number(cat.dataset.total);
  const tmpl = result.dataset.template || 'Showing {n} of {m}';

  const sync = () => {
    const u = new URL(location.href);
    state.q ? u.searchParams.set('q', state.q) : u.searchParams.delete('q');
    state.tags.length ? u.searchParams.set('tags', state.tags.join(',')) : u.searchParams.delete('tags');
    state.def !== 'all' ? u.searchParams.set('def', state.def) : u.searchParams.delete('def');
    state.view !== 'grid' ? u.searchParams.set('view', state.view) : u.searchParams.delete('view');
    history.replaceState(null, '', u);
  };
  const apply = () => {
    const q = state.q.trim().toLowerCase();
    // Grid and list hold the same items; count one of them.
    const grid = $$<HTMLElement>('.grid [data-item]', cat);
    let n = 0;
    for (const el of $$<HTMLElement>('[data-item]', cat)) {
      const ok = (!q || (el.dataset.search || '').includes(q))
        && (!state.tags.length || state.tags.some(t => (el.dataset.tags || '').split('|').includes(t)))
        && (state.def === 'all' || el.dataset.def === state.def);
      el.hidden = !ok;
      if (ok && grid.includes(el)) n++;
    }
    result.textContent = tmpl.replace('{n}', String(n)).replace('{m}', String(total));
    empty.hidden = n !== 0;
    cat.dataset.view = state.view;
    for (const b of $$<HTMLElement>('[data-view-opt]', cat)) b.setAttribute('aria-checked', String(b.dataset.viewOpt === state.view));
    for (const b of $$<HTMLElement>('[data-def-opt]', cat)) b.setAttribute('aria-checked', String(b.dataset.defOpt === state.def));
    for (const b of $$<HTMLElement>('[data-tag]', cat)) b.setAttribute('aria-pressed', String(state.tags.includes(b.dataset.tag!)));
    search.value = state.q;
    sync();
  };
  search.addEventListener('input', () => { state.q = search.value; apply(); });
  for (const b of $$<HTMLElement>('[data-view-opt]', cat)) b.addEventListener('click', () => { state.view = b.dataset.viewOpt!; apply(); });
  for (const b of $$<HTMLElement>('[data-def-opt]', cat)) b.addEventListener('click', () => { state.def = b.dataset.defOpt!; apply(); });
  for (const b of $$<HTMLElement>('[data-tag]', cat)) b.addEventListener('click', () => {
    const t = b.dataset.tag!;
    state.tags = state.tags.includes(t) ? state.tags.filter(x => x !== t) : [...state.tags, t];
    apply();
  });
  cat.querySelector('[data-reset]')?.addEventListener('click', () => { state.q = ''; state.tags = []; state.def = 'all'; apply(); });
  apply();
}
