// Social preview images (og:image), one 1200×630 PNG per page, rendered at
// build with satori (layout to SVG) and resvg (SVG to PNG). The text comes from
// the same data layer as the pages.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { HOME } from './i18n';
import { KIT, agents, commands, counts, packs } from './data';

export interface Card { slug: string; kicker: string; title: string; desc: string; path: string }

export const ogPath = (pagePath: string) => `/og/${pagePath === '/' ? 'home' : pagePath.replace(/^\//, '')}.png`;

export function ogCards(): Card[] {
  const v = `v${KIT.version} · MIT · open source`;
  return [
    { slug: 'home', kicker: v, title: HOME.en.h1, desc: HOME.en.sub, path: '/' },
    { slug: 'br', kicker: `v${KIT.version} · MIT · código aberto`, title: HOME.br.h1, desc: HOME.br.sub, path: '/br' },
    { slug: '404', kicker: v, title: 'Page not found', desc: HOME.en.sub, path: '/' },
    { slug: 'skills', kicker: 'Skills', title: `${counts.packs} skill packs`, desc: `From the ecosystem's own repositories, each pinned to a commit and scanned. ${counts.defaultPacks} installed by default.`, path: '/skills' },
    { slug: 'agents', kicker: 'Agents', title: `${counts.agents} specialized agents`, desc: agents.map(a => a.id).join(', '), path: '/agents' },
    { slug: 'commands', kicker: 'Commands', title: `${counts.commands} workflow commands`, desc: commands.map(c => '/' + c.id).join(', '), path: '/commands' },
    ...packs.map(p => ({ slug: `skills/${p.id}`, kicker: `Skill pack${p.maintainer ? ' · ' + p.maintainer : ''}`, title: p.name, desc: p.description, path: `/skills/${p.id}` })),
    ...agents.map(a => ({ slug: `agents/${a.id}`, kicker: 'Agent', title: a.id, desc: a.description, path: `/agents/${a.id}` })),
    ...commands.map(c => ({ slug: `commands/${c.id}`, kicker: 'Command', title: '/' + c.id, desc: c.description, path: `/commands/${c.id}` }))
  ];
}

const font = (pkg: string, file: string) => readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
let fonts: { name: string; data: Buffer; weight: 400 | 500; style: 'normal' }[] | null = null;
const loadFonts = () => (fonts ??= [
  { name: 'VT323', data: font('vt323', 'vt323-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'VT323', data: font('vt323', 'vt323-latin-ext-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Plex', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Plex', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-ext-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Plex', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff'), weight: 500, style: 'normal' }
]);

const wordmark = () => 'data:image/svg+xml;base64,' + readFileSync(join(process.cwd(), 'public/wordmark.svg')).toString('base64');

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).replace(/[\s,;:·]+\S*$/, '') + '…' : s);
type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({ type, props: { style, children, ...extra } });

const C = { bg: '#0a0d0b', text: '#e2ede6', muted: '#9daea4', accent: '#14f195', line: '#26302a' };

export async function renderOg(card: Card) {
  const titleSize = card.title.length > 34 ? 72 : card.title.length > 22 ? 92 : 112;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: C.bg, color: C.text, padding: '56px 72px', fontFamily: 'Plex', border: `2px solid ${C.line}` }, [
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      h('img', { width: 232, height: 50 }, undefined, { src: wordmark() }),
      h('div', { display: 'flex', fontSize: 24, color: C.muted }, 'ai.superteam.codes')
    ]),
    h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }, [
      h('div', { display: 'flex', fontSize: 26, color: C.accent, marginBottom: 18 }, card.kicker),
      h('div', { display: 'flex', fontFamily: 'VT323', fontSize: titleSize, lineHeight: 1, letterSpacing: -1 }, clip(card.title, 60)),
      h('div', { display: 'flex', fontSize: 28, lineHeight: 1.45, color: C.muted, marginTop: 26, maxWidth: 1000 }, clip(card.desc, 170))
    ]),
    h('div', { display: 'flex', alignItems: 'center', fontSize: 24, color: C.muted, borderTop: `2px solid ${C.line}`, paddingTop: 22 }, [
      h('div', { display: 'flex', color: C.accent, marginRight: 14 }, '$'),
      h('div', { display: 'flex', color: C.text }, 'curl -fsSL https://aikit.superteam.codes | bash')
    ])
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
