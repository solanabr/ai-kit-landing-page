import { SITE } from '../lib/site';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
