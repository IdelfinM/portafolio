---
title: Parche de emergencia de PHP el mismo día de su publicación
project: clinica-dental
summary: PHP publicó correcciones urgentes para dos fallas críticas de ejecución remota de código (PHP2Shell).
result: La aplicación quedó en la versión corregida el mismo día del anuncio, con un corte de menos de un segundo y sin arrancar servicios apagados a propósito.
tags: [Seguridad, Linux, PHP-FPM, Infraestructura]
order: 17
---

## Contexto

La aplicación corre en producción con nginx y PHP-FPM 8.4 sobre Ubuntu. En el mismo servidor hay otras versiones de PHP instaladas para línea de comandos, y servicios que están detenidos a propósito, entre ellos Apache, que chocaría con nginx en el puerto 80.

## Problema

El 21 de octubre de 2026 el proyecto PHP publicó de urgencia las versiones 8.5.12, 8.4.27 y 8.3.36, que corrigen **CVE-2026-109618 y CVE-2026-109619** (conocidas como PHP2Shell): dos fallas críticas que permiten ejecutar código en el servidor sin iniciar sesión. Los detalles se habían filtrado un día antes y ya había reportes de intentos de explotación.

## Diagnóstico

Primero confirmé el alcance antes de tocar nada:

- El servidor corría **PHP 8.4.26**, una versión afectada; el repositorio de paquetes ya ofrecía la 8.4.27.
- Contrasté el aviso oficial y varias fuentes de seguridad para confirmar que 8.4.27 era la versión que corrige ambas fallas.
- Además de la 8.4 que sirve la aplicación, había PHP 8.3 y 8.5 instalados, y el módulo de PHP para Apache. Según el aviso, ese módulo es el caso más expuesto; aunque Apache estaba apagado, no tenía sentido dejarlo vulnerable.

## Solución

Actualicé **solo los paquetes de PHP** de las tres ramas, sin arrastrar una actualización completa del sistema en plena emergencia, y con dos cuidados:

- **Sin instalar nada nuevo:** `apt-get install --only-upgrade` con la lista exacta de paquetes que tenían versión nueva.
- **Sin despertar servicios apagados:** un `policy-rc.d` temporal que impide a los paquetes arrancar servicios que no estaban activos, y una comparación de servicios activos antes y después para levantar cualquiera que la actualización hubiera dejado detenido.

## Resultado

- PHP-FPM se reinició con la versión **8.4.27**; ningún proceso quedó usando el binario anterior y el reinicio vació OPcache.
- El sitio respondió 200 de inmediato y no aparecieron errores nuevos en los registros de PHP-FPM ni de la aplicación. El corte fue de menos de un segundo.
- Después volví a refrescar los índices de paquetes y comprobé uno por uno que ningún paquete de PHP quedaba con actualización pendiente.
- El procedimiento quedó como script reutilizable para el próximo parche puntual de PHP.
