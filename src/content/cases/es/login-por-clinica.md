---
title: Un correo, cualquier clínica
project: clinica-dental
summary: En una plataforma multiclínica, el login no sabía desde qué clínica se estaba entrando.
result: Cada usuario solo puede entrar por el portal de su clínica, y la respuesta no permite averiguar a qué clínica pertenece un correo. Lo cubren 13 pruebas.
tags: [Laravel, Seguridad, Multi-tenant]
order: 10
---

## Contexto

Cada clínica tiene su propio portal: `/{clínica}/login`. La administración de la plataforma entra por un acceso aparte.

## Problema

Un usuario de la clínica A podía iniciar sesión desde el portal de la clínica B o desde el login genérico. Los datos seguían aislados por clínica, pero la separación entre portales no existía de verdad.

## Diagnóstico

El servicio de autenticación buscaba al usuario solo por su correo, que es único en toda la plataforma, y nunca miraba la URL desde la que llegaba la petición.

## Solución

- Antes de cualquier otra comprobación, el login compara la clínica del usuario con la clínica de la URL.
- **Mismo mensaje para todo rechazo:** un intento desde el portal equivocado responde exactamente "credenciales incorrectas", igual que una contraseña errónea. Si respondiera "este usuario no pertenece a esta clínica", cualquiera podría averiguar a qué clínica pertenece un correo probando portales.
- Cualquier rechazo cierra e invalida la sesión recién iniciada antes de responder.

## Resultado

Los portales están aislados de verdad y la respuesta no filtra información.
