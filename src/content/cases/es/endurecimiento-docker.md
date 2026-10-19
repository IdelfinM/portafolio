---
title: Defensa en capas para exponer una aplicación a Internet
project: lab-reserva
summary: Lo que hay entre Internet y el código de Laravel, y por qué cada capa está ahí.
result: Cada capa cubre un fallo distinto, y cada publicación tiene una vía de reversión preparada antes de empezar.
tags: [Docker, nginx, Seguridad, Infraestructura]
order: 14
---

## Contexto

Lab-Reserva quedó publicada en Internet, en un servidor que comparte con otra aplicación en producción.

## Problema

El framework trae protecciones (CSRF, throttle, validación), pero confiar solo en ellas significa que cualquier fallo de la aplicación queda directamente expuesto.

## Solución

**Red y contenedores**
- Solo el nginx interno publica un puerto, y únicamente en `127.0.0.1`. La base de datos no publica ninguno.
- `no-new-privileges` en todos los contenedores, y las capacidades del kernel reducidas al mínimo.

**nginx del host, antes de llegar a PHP**
- Rate limit de 10 peticiones por minuto por IP en login, registro y recuperación de contraseña.
- HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- **CSP en modo bloqueo** con `script-src 'self'`.

**Aplicación**
- `APP_DEBUG=false`. `.env` y `.git` devuelven 403 aunque estén fuera de `public/`.
- Versiones ocultas en nginx y PHP.

**Operación**
- Antes de cada publicación: volcado de la base, copia del código y etiquetas `rollback-AAAAMMDD` sobre las imágenes de Docker. Volver atrás es cambiar de etiqueta, no reconstruir.

## Resultado

Si una capa falla, la siguiente sigue en pie. Y una mala publicación se revierte en minutos.
