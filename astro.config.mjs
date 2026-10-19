// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { site } from './src/config/site.ts';

// Sitio 100 % estatico: el mismo dist/ lo sirve el contenedor del 3020 y el espejo de
// Cloudflare Pages. `site` solo se usa para las URL absolutas (canonical, hreflang, Open Graph).
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Todo el CSS en ficheros: la CSP es style-src 'self' y bloquearia un <style> en linea.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
