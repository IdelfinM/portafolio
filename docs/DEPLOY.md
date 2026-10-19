# Despliegue

El mismo código, dos destinos:

| Destino | Para qué | Cómo |
|---|---|---|
| `https://idmdev.net` | Enlace que se entrega en el CV. 24/7. | GitHub Pages, workflow `.github/workflows/deploy.yml` en cada push a `main` |
| `https://home.idmdev.net` (opcional) | Copia en el servidor casero, enlazada en el pie como prueba de DevOps. | Docker Compose detrás del nginx del host |

El servidor casero se apaga de noche si nadie lo usa; por eso el enlace principal es GitHub Pages. Los
demás subdominios de `idmdev.net` quedan libres para las aplicaciones del servidor.

## Publicar una versión nueva

```bash
cp .deploy.env.example .deploy.env   # solo la primera vez; completar usuario@host
git commit ...                       # publicar exige el árbol limpio
scripts/publicar.sh                  # los dos destinos
scripts/publicar.sh github           # solo el push (GitHub Pages)
scripts/publicar.sh servidor         # solo el contenedor
```

El script compila y corre `scripts/verificar-dist.mjs` con los patrones privados de `.verificar.local`
(no versionado). Antes del push busca esos mismos patrones en el código versionado, porque el repo es
público. Después:

- **GitHub:** `git push origin main`. El workflow vuelve a compilar y verificar (solo con las reglas
  genéricas) y publica. Rollback: `git revert` + push, o relanzar en Actions un despliegue anterior.
- **Servidor:** envía lo versionado por `tar` sobre ssh (respeta `.gitignore`), etiqueta la imagen
  actual como `portafolio/web:rollback-AAAAMMDDHHMM`, hace `docker compose build` + `up -d --wait` y
  prueba `/healthz`. Rollback: `docker tag portafolio/web:rollback-<fecha> portafolio/web:latest &&
  docker compose up -d` en `~/portafolio`.

## Cabeceras de seguridad

GitHub Pages no deja definir cabeceras. La CSP va en un `<meta http-equiv>` de
`src/layouts/Base.astro` (sin `frame-ancestors`, que en `<meta>` no tiene efecto). GitHub sí pone HSTS
cuando "Enforce HTTPS" está activo. La copia del servidor manda todas las cabeceras desde nginx
(`docker/host-nginx/portafolio-proxy.conf`).

## DNS en Cloudflare (`idmdev.net`)

Todos los registros en **solo DNS (nube gris)**. Con proxy, GitHub no puede emitir el certificado y
certbot no llega al servidor.

| Tipo | Nombre | Contenido |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (cuatro registros) |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `idelfinm.github.io` |
| TXT | `_github-pages-challenge-IdelfinM` | el valor que da GitHub al verificar el dominio |
| CNAME | `home` (y otras apps) | el hostname DDNS del servidor |

Verificar el dominio en GitHub (Settings de la cuenta → Pages → Add a domain) evita que otro usuario
lo reclame si el sitio se desactiva.

## Piezas en el servidor

| Fichero del repo | Instalado en |
|---|---|
| `compose.yaml`, `Dockerfile`, `docker/nginx/default.conf` | `~/portafolio/` (los trae `publicar.sh`) |
| `docker/systemd/portafolio.service` | `/etc/systemd/system/portafolio.service` (USUARIO reemplazado) |
| `docker/host-nginx/portafolio.conf` | `/etc/nginx/sites-available/portafolio` + enlace en `sites-enabled` (DOMINIO_CASA reemplazado) |
| `docker/host-nginx/portafolio-proxy.conf` | `/etc/nginx/snippets/portafolio-proxy.conf` |

- El contenedor publica **solo** en `127.0.0.1:8083` (8081 y 8082 los usa Lab-Reserva). Imagen
  `nginx-unprivileged`, `read_only`, sin capacidades, `no-new-privileges`, 64 MiB de tope; en reposo
  usa unos 9 MiB.
- `portafolio.service` es oneshot + RemainAfterExit, `enabled`: start = `compose up -d --wait`, stop =
  `compose stop`. Existe para que el Panel 3020 lo maneje como cualquier unidad. Operar con
  `sudo systemctl start|stop portafolio`, no con `docker compose down`.
- El vhost es un `server` propio: no se toca el vhost de la clínica ni el include de Lab-Reserva.

### Publicar la copia en `home.idmdev.net`

Con el CNAME `home` ya resolviendo al servidor:

```bash
sed 's/DOMINIO_CASA/home.idmdev.net/' ~/portafolio/docker/host-nginx/portafolio.conf \
  | sudo tee /etc/nginx/sites-available/portafolio
sudo cp ~/portafolio/docker/host-nginx/portafolio-proxy.conf /etc/nginx/snippets/
sudo ln -s /etc/nginx/sites-available/portafolio /etc/nginx/sites-enabled/portafolio
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d home.idmdev.net --redirect
```

Si `nginx -t` falla no se recarga nada y los demás sitios siguen como estaban. Después, poner
`selfHostedUrl: 'https://home.idmdev.net/'` en `src/config/site.ts` para que aparezca en el pie.
