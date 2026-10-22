import { defineConfig } from 'astro/config';

// SITE_URL decides the absolute URLs in the Markdown twins, llms.txt, canonical
// links and hreflang. The installer and the kit's raw files stay on
// aikit.superteam.codes; this site does not serve them.
export default defineConfig({
  site: process.env.SITE_URL || 'https://ai.superteam.codes',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false }
});
