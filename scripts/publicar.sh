#!/usr/bin/env bash
# Publica el portafolio en los dos destinos con el mismo codigo:
#   1. GitHub Pages (idmdev.net): basta con el push a main; lo publica .github/workflows/deploy.yml.
#   2. el contenedor del servidor casero (tar por ssh + docker compose build).
#
# Uso (Git Bash, desde la raiz del repo):
#   scripts/publicar.sh            # los dos destinos
#   scripts/publicar.sh github     # solo el push (GitHub Pages)
#   scripts/publicar.sh servidor   # solo el contenedor
#
# El servidor sale de .deploy.env (no versionado, ver .deploy.env.example).
set -euo pipefail

cd "$(dirname "$0")/.."
destino="${1:-todo}"

# El build y la verificacion corren siempre, con los patrones privados de .verificar.local, que el
# workflow de GitHub no tiene: nada sale si dist/ trae datos que no deben publicarse.
npm run build
node scripts/verificar-dist.mjs

if [[ "$destino" == "todo" || "$destino" == "github" ]]; then
  echo "== GitHub Pages"
  # El repo es publico: los mismos patrones privados se buscan tambien en el codigo versionado.
  if [[ -f .verificar.local ]]; then
    patrones=$(grep -vE '^\s*(#|$)' .verificar.local | cut -f1 | paste -sd'|')
    if git grep -nIiE "$patrones" -- . ':!package-lock.json'; then
      echo "Hay datos privados en archivos versionados (arriba). No se hace push."; exit 1
    fi
  fi
  [[ -z "$(git status --porcelain)" ]] || { echo "Hay cambios sin commit; commitea antes de publicar."; exit 1; }
  git push origin main
  echo "   El workflow 'Publicar en GitHub Pages' publica en 1-2 min (pestana Actions del repo)."
fi

if [[ "$destino" == "todo" || "$destino" == "servidor" ]]; then
  [[ -f .deploy.env ]] || { echo "Falta .deploy.env (copia .deploy.env.example)"; exit 1; }
  # shellcheck disable=SC1091
  source .deploy.env
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

echo "Publicado ($destino)."
