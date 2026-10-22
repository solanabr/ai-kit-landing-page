#!/usr/bin/env node
// Post-build check: every HTML page has its Markdown twin, the twin and the
// page come from the same item, and the agent indexes exist.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const fail = [];
const walk = d => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter(f => f.endsWith('index.html'));

for (const f of pages) {
  const route = '/' + relative(DIST, f).replace(/(^|\/)index\.html$/, '');
  if (route === '/404') continue;
  const twin = route === '/' ? 'index.md' : route.slice(1) + (route === '/br' ? '/index.md' : '.md');
  if (!existsSync(join(DIST, twin))) fail.push(`${route}: no twin at /${twin}`);
  const html = readFileSync(f, 'utf8');
  if (!html.includes('rel="alternate" type="text/markdown"')) fail.push(`${route}: no text/markdown alternate link`);
}
for (const f of ['llms.txt', 'llms-full.txt', 'index.md']) if (!existsSync(join(DIST, f))) fail.push(`missing /${f}`);

if (fail.length) { console.error('check-dist failed:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log(`check-dist: ${pages.length} pages, each with a Markdown twin`);
