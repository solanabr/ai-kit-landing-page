// Every HTML page, built from the same data layer as the pages themselves, so a
// new agent, command or pack is listed without an edit here. The home page
// carries its hreflang alternates.
import { agents, commands, packs, pagePath } from '../lib/data';
import { SITE } from '../lib/site';

export function GET() {
  const home = [['en', '/'], ['pt-BR', '/br'], ['x-default', '/']]
    .map(([l, p]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}"/>`).join('');
  const paths = [
    '/skills', '/agents', '/commands',
    ...packs.map(p => pagePath('skills', p.id)),
    ...agents.map(a => pagePath('agents', a.id)),
    ...commands.map(c => pagePath('commands', c.id))
  ];
  const urls = [
    `<url><loc>${SITE}/</loc>${home}</url>`,
    `<url><loc>${SITE}/br</loc>${home}</url>`,
    ...paths.map(p => `<url><loc>${SITE}${p}</loc></url>`)
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
