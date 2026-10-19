---
title: Una segunda aplicación en el mismo dominio sin tocar la primera
project: lab-reserva
summary: Publicar una SPA de Laravel y Vue en Docker bajo una subruta de un dominio que ya servía otra aplicación PHP.
result: Dos aplicaciones independientes comparten dominio y certificado. Retirar la segunda es quitar una línea del vhost.
tags: [Docker, nginx, Laravel, Vue, Infraestructura]
order: 5
---

## Contexto

El servidor ya servía una aplicación PHP en producción con nginx y PHP-FPM nativos. Lab-Reserva tenía que publicarse en `/lab-reserva` con el mismo dominio y el mismo certificado, pero sin compartir base de datos, PHP ni nada más.

## Problema

Al ponerla bajo una subruta aparecieron tres fallos a la vez:

- Las peticiones a `/lab-reserva/index.php` terminaban en el PHP-FPM de la **otra** aplicación.
- Las URL y los assets que generaba Laravel salían sin el prefijo.
- Las cookies de sesión de ambas aplicaciones podían pisarse.

## Diagnóstico

- **Precedencia de nginx:** las `location ~ \.php$` de expresión regular del sitio principal ganaban a un prefijo simple.
- **Laravel no sabía que estaba detrás de un proxy** con un prefijo.
- **El frontend compilado** tenía la ruta base fija en el momento del build.

## Solución

- `location ^~ /lab-reserva/` en el nginx del host, que gana a las expresiones regulares. Recorta el prefijo y reenvía al contenedor con `X-Forwarded-Prefix`, en el que Laravel confía mediante `TRUSTED_PROXIES`.
- La ruta base entra al build de Docker como argumento y se convierte en `ASSET_URL` para los chunks de Vite y en la base del router y del cliente HTTP.
- Cookies aisladas con `SESSION_PATH=/lab-reserva` y un nombre de sesión propio.
- Todo se integra en el sitio principal con un único `include`.

## Resultado

Las dos aplicaciones son independientes: cada una con su base de datos, su PHP y su ciclo de despliegue. El sitio original no se modificó más allá de esa línea.
