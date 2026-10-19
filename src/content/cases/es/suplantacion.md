---
title: Ver la aplicación como la ve el usuario, sin que él lo note
project: clinica-dental
summary: Suplantación de usuarios para soporte que no deja rastro en la cuenta del suplantado.
result: El soporte reproduce los fallos con la vista exacta del usuario. La sesión del usuario queda intacta, el panel de administración es inalcanzable mientras dura la suplantación y la bitácora registra todo.
tags: [Laravel, Seguridad, Sesiones, Vue]
order: 9
---

## Contexto

Cuando un usuario reporta "no me aparece tal cosa", la forma más rápida de entenderlo es ver la aplicación exactamente como la ve él, con su rol, su clínica y sus datos.

## Problema

El requisito principal era que la suplantación fuera **invisible para el suplantado**:

- No cambiarle la contraseña ni el perfil.
- No enviarle correos.
- No cerrarle sesiones en sus otros dispositivos.

Y al terminar, el administrador tenía que volver a su propia cuenta sin quedar atrapado.

## Diagnóstico

Cada atajo rompía algo:

- **Un token aparte** no pasa por los mismos middlewares que la sesión real, así que no muestra la vista exacta.
- **`logout()`** rota el `remember_token` del usuario y le cierra la sesión en sus otros dispositivos.
- **Una ruta de salida dentro de `/admin`** devolvería 403 mientras se está suplantando, y la sesión quedaría atrapada.

## Solución

- El cambio de identidad ocurre sobre la misma sesión de cookie. Al salir se usa `logoutCurrentDevice()` y no `logout()`.
- La ruta para terminar la suplantación vive fuera del grupo de administración.
- No se puede suplantar a otro SuperAdmin ni encadenar suplantaciones.
- Un middleware bloquea las acciones que dejarían rastro en la cuenta suplantada.
- Al salir se recarga la página completa, para que no queden datos del usuario en los stores de Pinia.
- Un banner fijo recuerda en todo momento que se está suplantando.

## Resultado

La suplantación es una herramienta de soporte segura. Una prueba fija que `/admin/*` es inalcanzable mientras dura. La bitácora sí registra todo lo que hace quien suplanta, y eso es intencional.
