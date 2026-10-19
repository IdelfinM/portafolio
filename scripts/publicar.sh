#!/usr/bin/env bash
# Publica el portafolio en los dos destinos con el mismo build:
#   1. el contenedor del servidor casero (tar por ssh + docker compose build), y
#   2. el espejo de Cloudflare Pages (wrangler pages deploy).
#
# Uso (Git Bash, desde la raiz del repo):
#   scripts/publicar.sh            # los dos destinos
#   scripts/publicar.sh servidor   # solo el contenedor
#   scripts/publicar.sh espejo     # solo Cloudflare Pages
#
# El destino sale de .deploy.env (no versionado, ver .deploy.env.example).
set -euo pipefail

cd "$(dirname "$0")/.."
[[ -f .deploy.env ]] || { echo "Falta .deploy.env (copia .deploy.env.example)"; exit 1; }
# shellcheck disable=SC1091
source .deploy.env
destino="${1:-todo}"

# El build y la verificacion corren siempre: nada sale si dist/ trae datos que no deben publicarse.
npm run build
node scripts/verificar-dist.mjs

if [[ "$destino" == "todo" || "$destino" == "servidor" ]]; then
  echo "== Servidor: $DEPLOY_SSH:$DEPLOY_DIR"
  # Mismo patron que Lab-Reserva: se envia lo versionado (respeta .gitignore, asi que ni
  # node_modules ni dist ni .deploy.env viajan) y el servidor compila su propia imagen.
  git ls-files -co --exclude-standard -z \
    | tar --null -czf - -T - \
    | ssh "$DEPLOY_SSH" "mkdir -p '$DEPLOY_DIR' && tar -xzf - -C '$DEPLOY_DIR'"
  # Etiqueta de rollback de la imagen actual antes de reemplazarla (si existe).
  ssh "$DEPLOY_SSH" "cd '$DEPLOY_DIR' \
    && (docker image inspect portafolio/web:latest >/dev/null 2>&1 \
        && docker tag portafolio/web:latest portafolio/web:rollback-\$(date +%Y%m%d%H%M) || true) \
    && docker compose build \
    && docker compose up -d --wait --wait-timeout 60 \
    && curl -fsS http://127.0.0.1:\${WEB_PORT:-8083}/healthz"
fi

if [[ "$destino" == "todo" || "$destino" == "espejo" ]]; then
  echo "== Espejo: Cloudflare Pages ($PAGES_PROJECT)"
  npx --yes wrangler pages deploy dist --project-name "$PAGES_PROJECT" --branch main
fi

echo "Publicado ($destino)."
