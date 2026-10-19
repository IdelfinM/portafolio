---
title: Las pruebas apuntaban a la base de datos de producción
project: clinica-dental
summary: La suite ignoraba la base de pruebas configurada y se conectaba a la real.
result: Ningún dato se alteró. La forma correcta de correr las pruebas quedó documentada y la causa entendida, no solo esquivada.
tags: [Laravel, Pruebas, Base de datos, Depuración]
featured: true
order: 4
---

## Contexto

En el servidor, la aplicación corre con las cachés de configuración y rutas de Laravel (`config:cache`, `route:cache`), como se recomienda en producción. Las pruebas usan una base aparte, `*_testing`.

## Problema

Al correr la suite en el servidor salieron dos síntomas: las rutas recién añadidas no existían para las pruebas, y la suite estaba conectada a la base de producción en lugar de la de pruebas.

## Diagnóstico

Con la configuración cacheada, Laravel carga `bootstrap/cache/config.php` y **no vuelve a leer las variables de entorno**. PHPUnit pasaba `DB_DATABASE=..._testing`, pero ese valor nunca llegaba a la aplicación: se usaba el de producción que estaba en la caché. Por la misma razón, la caché de rutas no conocía las rutas recién añadidas.

Cada prueba corría dentro de una transacción que se revierte al terminar, así que no se alteró ningún dato. Pero lo único que separaba la suite de los datos reales era ese detalle.

## Solución

Para las pruebas, la aplicación apunta a ficheros de caché que no existen, con `APP_CONFIG_CACHE` y `APP_ROUTES_CACHE`. Eso obliga a Laravel a leer la configuración real del entorno de pruebas sin tocar las cachés de producción. El comando completo quedó documentado junto con el porqué, para que nadie lo vuelva a correr sin esas variables.

## Resultado

La suite corre contra su propia base y con las rutas actuales. Me quedó un hábito: antes de confiar en una variable de entorno, verificar qué valor está usando de verdad la aplicación.
