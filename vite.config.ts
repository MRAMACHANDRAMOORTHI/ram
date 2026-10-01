import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/** Preload the three latin font files the first paint needs, so text never reflows under the loader. */
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
        const files = Object.keys(ctx.bundle).filter((f) => critical.some((re) => re.test(f)));
        return {
          html,
          tags: files.map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${f}`, crossorigin: '' },
            injectTo: 'head' as const,
          })),
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
