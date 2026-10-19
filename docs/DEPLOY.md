# Despliegue

Un solo build, dos destinos:

| Destino | Para que | Como |
|---|---|---|
| `https://<dominio>` | Enlace que se entrega en el CV. 24/7. | Cloudflare Pages, `wrangler pages deploy` |
| `https://home.<dominio>` | Copia en el servidor casero, enlazada en el pie como prueba de DevOps. | Docker Compose detras del nginx del host |

El servidor casero se apaga de noche si nadie lo usa; por eso el enlace principal es el espejo.

## Publicar una version nueva

```bash
cp .deploy.env.example .deploy.env   # solo la primera vez; completar usuario@host
scripts/publicar.sh                  # los dos destinos
scripts/publicar.sh servidor         # solo el contenedor
scripts/publicar.sh espejo           # solo Cloudflare Pages
```

El script compila, corre `scripts/verificar-dist.mjs` (aborta si `dist/` trae datos que no deben
salir) y luego:

- **Servidor:** envia lo versionado por `tar` sobre ssh (respeta `.gitignore`), etiqueta la imagen
  actual como `portafolio/web:rollback-AAAAMMDDHHMM`, hace `docker compose build` + `up -d --wait` y
  prueba `/healthz`.
- **Espejo:** `npx wrangler pages deploy dist`. La primera vez hace falta `npx wrangler login`.

**Rollback del contenedor:** `docker tag portafolio/web:rollback-<fecha> portafolio/web:latest &&
docker compose up -d` en `~/portafolio`. **Rollback del espejo:** desde el panel de Cloudflare Pages,
la lista de despliegues permite volver a uno anterior.

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
- El vhost es un `server` propio: no se toca el vhost de la clinica ni el include de Lab-Reserva.

## Alta inicial del dominio (una sola vez)

1. Comprar el dominio (Cloudflare Registrar) y crear el proyecto de Pages:
   `npx wrangler pages project create portafolio --production-branch main`.
2. En Pages > Custom domains: anadir `<dominio>` (apex).
3. En DNS de Cloudflare: `home` CNAME al hostname DDNS del servidor, **solo DNS (nube gris)**, para
   que certbot y el trafico lleguen directo al servidor.
4. En `src/config/site.ts`: `url` y `selfHostedUrl` con el dominio real.
5. En el servidor:
   ```bash
   sed 's/DOMINIO_CASA/home.<dominio>/' ~/portafolio/docker/host-nginx/portafolio.conf \
     | sudo tee /etc/nginx/sites-available/portafolio
   sudo cp ~/portafolio/docker/host-nginx/portafolio-proxy.conf /etc/nginx/snippets/
   sudo ln -s /etc/nginx/sites-available/portafolio /etc/nginx/sites-enabled/portafolio
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d home.<dominio> --redirect
   ```
   Si `nginx -t` falla no se recarga nada y los demas sitios siguen como estaban.

## Verificacion tras publicar

```bash
curl -sI https://home.<dominio>/es/ | grep -iE 'HTTP/|strict-transport|content-security'
curl -sI https://<dominio>/es/      | grep -iE 'HTTP/|strict-transport|content-security'
```

Y en el navegador: consola sin violaciones de CSP, ES y EN, movil y escritorio.
