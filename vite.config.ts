import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/** Preload what the first paint needs: three latin font files (no reflow under the loader) and the hero's face. */
function preloadCriticalFonts(): Plugin {
  let base = '/';
  const critical = [/geist-latin-wght-normal-.*\.woff2$/, /geist-mono-latin-wght-normal-.*\.woff2$/, /instrument-serif-latin-400-italic-.*\.woff2$/];
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const files = Object.keys(ctx.bundle);
        const fonts = files.filter((f) => critical.some((re) => re.test(f)));
        // The bobblehead's face texture: fetch it alongside the fonts.
        const portrait = files.filter((f) => /head-.*\.webp$/.test(f));
        return {
          html,
          tags: [
            ...fonts.map((f) => ({
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${f}`, crossorigin: '' },
              injectTo: 'head' as const,
            })),
            ...portrait.map((f) => ({
              tag: 'link',
              attrs: { rel: 'preload', as: 'image', type: 'image/webp', href: `${base}${f}`, fetchpriority: 'high' },
              injectTo: 'head' as const,
            })),
          ],
        };
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Long-lived vendor chunks survive content-only redeploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
        },
      },
    },
  },
});
