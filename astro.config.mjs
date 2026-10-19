// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { site } from './src/config/site.ts';

// Sitio 100 % estatico: el mismo dist/ lo sirven GitHub Pages (dominio publico) y el contenedor
// del servidor casero. `site` solo se usa para las URL absolutas (canonical, hreflang, Open Graph).
export default defineConfig({
  site: site.url,
  // GitHub Pages publica el repo en /portafolio/ (el workflow pasa BASE_PATH); el contenedor del
  // servidor y `npm run dev` sirven en la raiz.
  base: process.env.BASE_PATH || '/',
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
