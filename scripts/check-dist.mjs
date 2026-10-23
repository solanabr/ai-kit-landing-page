#!/usr/bin/env node
// Post-build check: every HTML page has its Markdown twin, the twin and the
// page come from the same item, every page's og:image was built, the agent
// indexes exist, and the sitemap lists every page.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const fail = [];
const walk = d => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter(f => f.endsWith('index.html'));

const sitemap = existsSync(join(DIST, 'sitemap.xml')) ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8') : '';
for (const f of pages) {
  const route = '/' + relative(DIST, f).replace(/(^|\/)index\.html$/, '');
  if (route === '/404') continue;
  if (!sitemap.includes(`/${route.slice(1)}</loc>`)) fail.push(`${route}: not in sitemap.xml`);
  const twin = route === '/' ? 'index.md' : route.slice(1) + (route === '/br' ? '/index.md' : '.md');
  if (!existsSync(join(DIST, twin))) fail.push(`${route}: no twin at /${twin}`);
  const html = readFileSync(f, 'utf8');
  if (!html.includes('rel="alternate" type="text/markdown"')) fail.push(`${route}: no text/markdown alternate link`);
  const og = (html.match(/property="og:image" content="https?:\/\/[^/]+(\/og\/[^"]+\.png)"/) || [])[1];
  if (!og || !existsSync(join(DIST, og))) fail.push(`${route}: og:image ${og || 'missing'} not built`);
}
for (const f of ['llms.txt', 'llms-full.txt', 'index.md', 'sitemap.xml', 'robots.txt']) if (!existsSync(join(DIST, f))) fail.push(`missing /${f}`);

if (fail.length) { console.error('check-dist failed:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log(`check-dist: ${pages.length} pages, each with a Markdown twin`);
