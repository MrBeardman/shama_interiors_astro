// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://schamainteriors.es',
  trailingSlash: 'always',
  // Purely static: the old site has no contact form, so nothing needs a server (see docs/STATUS.md).
  output: 'static',
  build: { inlineStylesheets: 'always', format: 'directory' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-GB', es: 'es-ES' } } })],
});
