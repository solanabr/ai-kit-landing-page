import { defineConfig } from 'astro/config';

// SITE_URL decides the absolute URLs in the Markdown twins, llms.txt, canonical
// links and hreflang. It defaults to the host the kit already serves from.
export default defineConfig({
  site: process.env.SITE_URL || 'https://aikit.superteam.codes',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false }
});
