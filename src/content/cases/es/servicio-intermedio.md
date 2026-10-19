---
title: Por qué las cajas no se conectan a la base de datos
project: larimar
summary: La decisión de arquitectura más importante de Larimar, con las alternativas que se descartaron y por qué.
result: Las reglas fiscales y la numeración de comprobantes viven en un solo punto, el certificado nunca toca una caja, y una actualización se instala en una sola máquina.
tags: [.NET, Arquitectura, PostgreSQL]
order: 11
---

## Contexto

El sistema heredado conectaba cada estación directamente a la base de datos. En un comercio con varias cajas, eso significa que la lógica de negocio y las credenciales de la base están repetidas en cada equipo.

## Problema

Hay reglas que no pueden fallar:

- **Los comprobantes fiscales (NCF) no se pueden duplicar ni saltar.**
- **El certificado digital** para la facturación electrónica no debe salir del servidor.

Con conexión directa, cada caja tendría que aplicar las reglas por su cuenta y tener acceso a todo.

## Diagnóstico

La pregunta no era qué tecnología usar, sino dónde vive cada responsabilidad. Si la numeración se asigna en un solo punto, no puede duplicarse. Si solo un proceso tiene la cadena de conexión, robar una caja no da acceso a la base de datos.

## Solución

Un **servicio de Windows con ASP.NET Core** es el único que habla con PostgreSQL y el único que guarda la cadena de conexión y el certificado. Las estaciones de escritorio, hechas con Avalonia, solo hablan con ese servicio, a través de un proyecto de contratos compartido.

Alternativas descartadas, cada una por una razón concreta:

- **Electron / Tauri:** la impresión matricial y las rejillas de datos grandes.
- **WPF:** en modo mantenimiento y atado a Windows.
- **SQL Server Express:** tope de tamaño y licencia.
- **SQLite:** no aguanta la concurrencia de varias cajas.
- **Solo nube:** cada caída de Internet impediría facturar.

## Resultado

Unas pruebas de arquitectura vigilan que ninguna capa dependa de otra indebida, así que la decisión no se erosiona con el tiempo. Una actualización del negocio se instala en el servidor y no en cada caja.
