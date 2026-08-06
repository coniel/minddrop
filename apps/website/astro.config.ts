import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { blogAssets, rewriteBlogAssetPaths } from './src/blogAssets';

export default defineConfig({
  site: 'https://minddrop.app',
  integrations: [sitemap(), blogAssets()],
  markdown: {
    processor: satteri({
      // Rewrite relative image references in posts to public URLs
      mdastPlugins: [rewriteBlogAssetPaths()],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      // Emit both themes as custom properties rather than inlining one of
      // them, so the stylesheet can pick between them with `light-dark()`
      defaultColor: false,
    },
  },
});
