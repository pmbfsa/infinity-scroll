import { defineConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';
import webfontDownload from 'vite-plugin-webfont-dl';

export default defineConfig({
  base: './',
  plugins: [
    sitemap({
      hostname: 'https://pmbfsa.github.io/infinity-scroll/',
      outDir: 'docs',
    }),
    webfontDownload(
      ['https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'],
      { assetsSubfolder: 'fonts' },
    ),
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
