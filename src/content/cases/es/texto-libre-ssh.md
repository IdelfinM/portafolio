---
title: Texto libre hacia un shell remoto, sin abrir la puerta a una inyección
project: panel-servidor
summary: El panel necesitaba enviar mensajes escritos por una persona a un script del servidor por SSH.
result: Probado con comillas, $( ), punto y coma y acentos. El texto llega intacto y nunca se ejecuta.
tags: [Seguridad, Node.js, Linux]
order: 13
---

## Contexto

El panel opera el servidor por SSH, y su regla de diseño es que **el navegador solo envía identificadores**. Los comandos salen de una configuración validada y nunca se construyen con datos de la petición.

## Problema

Una función nueva rompía esa regla por necesidad: enviar un aviso escrito libremente por el administrador a un script del servidor. Cualquier texto que llegue a un shell es una invitación a la inyección. Basta un `'; rm -rf ~ #` mal escapado.

## Diagnóstico

Escapar comillas a mano es frágil: hay demasiados metacaracteres y varias capas de interpretación (Node, SSH y el shell remoto). La solución más segura era que el texto **no pudiera contener** nada interpretable.

## Solución

1. Limpiar caracteres de control y limitar la longitud a 200.
2. Codificar el texto en **base64** en el panel.
3. En el servidor, decodificarlo dentro de una sustitución entre comillas dobles: `"$(printf %s '<b64>' | base64 -d)"`.

Entre las comillas simples solo pueden aparecer `A-Z`, `a-z`, `0-9`, `+`, `/` y `=`, ninguno de los cuales significa nada para el shell. El texto decodificado llega como un único argumento y nunca se evalúa.

## Resultado

Es el único punto del panel donde texto libre llega al servidor, y está aislado en una sola función compartida, así que no hay una segunda implementación que pueda quedarse atrás. Lo probé con los ataques típicos de inyección y con texto en español con acentos.
