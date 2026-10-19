---
title: Un registro de actividad que la propia aplicación no puede alterar
project: lab-reserva
summary: Trazabilidad completa de quién hizo qué, incluidas las acciones que no pasan por ningún modelo.
result: Cada cambio queda con su antes y su después, la IP y el navegador. Lo cubren 13 pruebas de backend y una de frontend, y el límite de la garantía está documentado.
tags: [Laravel, Seguridad, Auditoría, Vue]
order: 7
---

## Contexto

La administración necesitaba responder preguntas como "¿quién cambió este permiso?" o "¿quién exportó estos datos?". No había ningún registro.

## Problema

Lo obvio era engancharse a los eventos de Eloquent (created, updated, deleted). Pero varias de las acciones más sensibles **no son cambios de un modelo**: iniciar sesión, un intento fallido, cerrar sesión, sincronizar permisos o exportar un reporte.

## Diagnóstico

Hacían falta dos fuentes:

- Un observer para los cambios de datos.
- Eventos explícitos donde no hay modelo.

Además, un registro de auditoría solo vale si nadie puede editarlo desde la aplicación, ni siquiera un administrador.

## Solución

- **`ActivityObserver`** guarda el antes y el después campo por campo. Los valores sensibles (contraseñas, tokens) se guardan como `[oculto]`.
- **Eventos explícitos** para login, login fallido, logout, sincronizaciones, tareas programadas y exportaciones.
- **Inmutabilidad en el modelo:** cualquier intento de actualizar o borrar una fila lanza una excepción, y la API solo expone una ruta de lectura.
- **Acceso restringido** al rol base de administrador. Es un permiso que no se puede otorgar desde el RBAC, para que nadie se lo conceda a sí mismo.

## Resultado

El registro está en producción y se conserva para siempre, por decisión del dueño del sistema. Documenté el límite con honestidad: la inmutabilidad es de aplicación, y quien tenga acceso directo a la base de datos sí podría borrar filas.
