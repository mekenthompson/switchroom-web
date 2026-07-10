import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://switchroom.ai',
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
});
