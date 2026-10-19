# Portafolio - instrucciones para la IA

Sitio portafolio de un ingeniero de software full-stack, pensado para entregarlo a reclutadores.
Astro 7 (estatico) + Tailwind 4, bilingue ES/EN, sin backend. Se publica en dos sitios con el mismo
`dist/`: un contenedor Docker en el servidor casero y un espejo en Cloudflare Pages (24/7, porque el
servidor se apaga de noche). Detalle operativo en `docs/DEPLOY.md`.

## Reglas de contenido (no negociables)

1. **Solo hechos verificables.** Cada caso sale de documentacion real del proyecto (CHANGELOG,
   EstadoActual.md, README, docs/). No se inventan cifras, causas ni secuencias de hechos para que la
   historia quede mejor. Si algo esta planificado y no hecho, se dice "siguiente fase".
2. **Nada de infraestructura ni datos reales:** ni hostnames del servidor, ni IPs, ni usuarios del
   sistema, ni rutas `/home/...`, ni el nombre de la clinica (va anonima), ni correos de usuarios.
   `scripts/verificar-dist.mjs` lo comprueba sobre `dist/` y bloquea la publicacion.
3. **El servidor de juegos no aparece** en el portafolio (decision del dueno, 2026-10-19).
4. **Proyectos de empleador** (`confidential: true`): solo alcance y rol, sin codigo ni capturas.
   `draft: true` hasta que el dueno confirme con su empleador.
5. Texto visible con ortografia completa (tildes, n con virgulilla). Comentarios de codigo en espanol
   sin tildes, explicando el porque.

## Estructura

- `src/content/{projects,cases}/{es,en}/<slug>.md`: una entrada por idioma, **mismo slug** en ambos
  (el selector de idioma depende de eso). Esquemas en `src/content.config.ts`.
- Casos: frontmatter `project` = slug del proyecto; cuerpo con `## Contexto / Problema / Diagnostico /
  Solucion / Resultado` (en ingles Context / Problem / Diagnosis / Solution / Result).
- `src/pages/{es,en}/...`: envoltorios delgados; la logica esta en `src/views/`. Las URL se traducen
  (`/es/proyectos/` = `/en/projects/`), mapa en `src/i18n/ui.ts`.
- Datos personales y dominio: `src/config/site.ts` (de ahi lee `astro.config.mjs`).
- Ojo con YAML: un `: ` dentro de un elemento de lista sin comillas lo convierte en objeto.

## CSP estricta

Las cabeceras (nginx del host y `public/_headers`) llevan `script-src 'self'; style-src 'self'`.
Por eso: `inlineStylesheets: 'never'`, ningun `<script>` en linea (los scripts van en `public/js/` con
`is:inline src=...`), ningun atributo `style=`, ninguna fuente ni recurso de terceros. Tras cada
build: `grep -rl '<style\|style="' dist` debe salir vacio.

## Comandos

```bash
npm run build                    # genera dist/
node scripts/verificar-dist.mjs  # barrera antes de publicar
npx astro preview --port 4321    # revisar dist/ en local
scripts/publicar.sh [servidor|espejo]   # build + verificacion + publicacion (ver docs/DEPLOY.md)
```
