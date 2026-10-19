# Etapa 1: compila el sitio estatico. node_modules no viaja (tar respeta .gitignore),
# por eso se instala aqui con el lockfile exacto.
FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Etapa 2: solo nginx y el dist/. Imagen sin privilegios: escucha en 8080 y corre como uid 101,
# asi el contenedor puede ir read_only y sin capacidades (ver compose.yaml).
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
