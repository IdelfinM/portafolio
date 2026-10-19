---
title: Crear el primer administrador sin dejar contraseñas en ninguna parte
project: lab-reserva
summary: Cómo dar de alta cuentas en producción sin seeders con credenciales ni contraseñas compartidas por chat.
result: Ninguna credencial queda en el repositorio, en los seeders ni en el historial. Toda cuenta nueva empieza con una contraseña de un solo uso.
tags: [Laravel, Seguridad, Vue]
order: 15
---

## Contexto

En desarrollo, un seeder crea un administrador con una contraseña conocida. En producción eso es inaceptable.

## Problema

Al publicar hacía falta un primer administrador, y después una forma de dar de alta usuarios sin que el administrador conozca ni comparta contraseñas definitivas.

## Solución

- El seeder de administrador **se omite en producción** a propósito.
- Un comando `lab:invite-user` genera una contraseña temporal aleatoria, la muestra **una sola vez** en consola y marca la cuenta con `must_change_password`.
- Un middleware bloquea toda la API con un 403 `password_change_required` hasta que el usuario la cambia. Solo deja pasar su perfil, el cierre de sesión y el cambio de contraseña.
- En el frontend, un guard del router lleva al usuario a la pantalla de cambio obligatorio.
- El botón "Nuevo usuario" del panel de administración usa **el mismo servicio** que el comando: hay un solo camino de alta.

## Resultado

La contraseña temporal solo sirve para fijar la definitiva, y el registro público nunca activa este flujo.
