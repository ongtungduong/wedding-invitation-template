/// <reference types="vitest/config" />
import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { resolveLocalizedText, weddingConfigSchema } from './src/config/schema';
import { resolveThemePalette } from './src/config/themes';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function weddingSeoPlugin(): Plugin {
  const configPath = path.resolve(process.cwd(), 'wedding.config.json');
  let resolvedBase = '/';

  const readValidatedConfig = () => {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return weddingConfigSchema.parse(raw);
  };

  const buildManifest = () => {
    const cfg = readValidatedConfig();
    const lang = cfg.language.default;
    const palette = resolveThemePalette(cfg.theme);

    return JSON.stringify(
      {
        short_name: `${cfg.couple.brideShort} & ${cfg.couple.groomShort}`,
        name: resolveLocalizedText(cfg.seo.title, lang),
        icons: [
          {
            src: `${resolvedBase}favicon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        start_url: resolvedBase,
        display: 'standalone',
        theme_color: palette.accent,
        background_color: palette.bgBlush,
      },
      null,
      2,
    );
  };

  return {
    name: 'wedding-seo-manifest',
    configResolved(config) {
      resolvedBase = config.base.endsWith('/') ? config.base : `${config.base}/`;
      // Fail fast if wedding.config.json is invalid
      readValidatedConfig();
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === `${resolvedBase}manifest.json` || req.url === '/manifest.json') {
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          res.end(buildManifest());
          return;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      const cfg = readValidatedConfig();
      const lang = cfg.language.default;
      const palette = resolveThemePalette(cfg.theme);
      const title = escapeHtml(resolveLocalizedText(cfg.seo.title, lang));
      const description = escapeHtml(resolveLocalizedText(cfg.seo.description, lang));
      const robots = escapeHtml(cfg.seo.robots);
      const ogImage = escapeHtml(
        /^https?:\/\//i.test(cfg.seo.ogImage)
          ? cfg.seo.ogImage
          : `${resolvedBase}${cfg.seo.ogImage.replace(/^\/+/, '')}`,
      );

      return html
        .replace(/__HTML_LANG__/g, lang)
        .replace(/__THEME_COLOR__/g, palette.accent)
        .replace(/__SEO_TITLE__/g, title)
        .replace(/__SEO_DESCRIPTION__/g, description)
        .replace(/__SEO_ROBOTS__/g, robots)
        .replace(/__OG_IMAGE__/g, ogImage);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: buildManifest(),
      });
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), weddingSeoPlugin()],
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
