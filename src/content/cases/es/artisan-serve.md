---
title: Una petición lenta congelaba todo el sitio
project: clinica-dental
summary: La aplicación en producción se servía con un único proceso de PHP.
result: El sitio atiende peticiones en paralelo con nginx y PHP-FPM, y la configuración anterior quedó lista como vía de reversión.
tags: [Linux, nginx, PHP-FPM, Rendimiento, Infraestructura]
order: 6
---

## Contexto

En sus inicios la aplicación corría con `php artisan serve`, detrás de nginx como proxy, bajo un servicio de systemd.

## Problema

Cuando una petición tardaba, todas las demás quedaban en cola detrás de ella: una sola operación lenta congelaba el sitio para todos los usuarios.

## Diagnóstico

`artisan serve` es el servidor de desarrollo de PHP: **un solo proceso que atiende una petición a la vez**. No es un problema de código, sino de cómo se estaba sirviendo.

## Solución

Migré a la arquitectura estándar de producción: nginx sirve `public/` directamente y pasa PHP a **PHP-FPM** por socket, con un pool de procesos. La migración trajo tareas operativas que dejé documentadas:

- **OPcache activo:** después de publicar código hay que recargar PHP-FPM.
- **Cachés de configuración, rutas y vistas** regeneradas en cada despliegue.
- **Permisos:** propietario `usuario:www-data` con el mínimo necesario, y una ACL para que `www-data` atraviese el home sin abrirlo al grupo.

El servicio antiguo quedó detenido y deshabilitado, pero no borrado, como vía de reversión. El panel de control del servidor se niega a arrancarlo, porque competiría con nginx.

## Resultado

Las peticiones se atienden en paralelo y una operación lenta ya no bloquea al resto.
