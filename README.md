# Portafolio

Sitio portafolio bilingüe (ES/EN): proyectos y casos de "problema → diagnóstico → solución".

- **Stack:** Astro 7 (estático), Tailwind CSS 4, contenido en Markdown con esquemas tipados.
- **Sin backend:** nada que atacar; CSP `script-src 'self'; style-src 'self'`.
- **Despliegue:** GitHub Pages en [idmdev.net](https://idmdev.net) con GitHub Actions, y una copia en un contenedor `nginx-unprivileged` de solo lectura detrás de un proxy TLS en mi servidor. Ver `docs/DEPLOY.md`.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && node scripts/verificar-dist.mjs
```
