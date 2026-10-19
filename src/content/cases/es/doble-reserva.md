---
title: Dos pacientes, el mismo hueco
project: clinica-dental
summary: Evitar que dos reservas simultáneas se queden con la misma hora del mismo odontólogo.
result: El conflicto se resuelve en la base de datos y el paciente que pierde ve la agenda actualizada al instante, sin un error genérico.
tags: [Laravel, Concurrencia, Base de datos, Vue]
order: 8
---

## Contexto

El asistente de reservas muestra los huecos libres y el paciente elige uno. Entre ver la lista y confirmar pueden pasar minutos.

## Problema

Dos pacientes pueden estar mirando el mismo hueco a la vez. Si los dos confirman, el sistema no puede crear dos citas en la misma hora con el mismo odontólogo.

## Diagnóstico

Volver a comprobar la disponibilidad al guardar es necesario pero no basta: entre esa comprobación y el `INSERT` hay una ventana en la que otra petición puede colarse.

## Solución

- **El servidor nunca confía en lo que mostró el asistente.** Revalida la disponibilidad al escribir y calcula la hora de fin a partir de la duración del tratamiento, sin aceptar la que envía el cliente.
- **Bloqueo en la base de datos:** dentro de una transacción, `lockForUpdate()` sobre el índice `(dentist_id, date)`. El gap lock de InnoDB serializa las reservas del mismo odontólogo y día.
- **409 y no 422:** un 422 significa "corrige tu formulario". Aquí el formulario era válido; lo que cambió fue la agenda. El frontend distingue el 409, vuelve al paso de elegir hora y refresca los huecos solo.

## Resultado

La regla se cumple en la capa que de verdad puede garantizarla. Hay una limitación que dejé escrita en el propio test: la suite corre sobre SQLite, que no tiene bloqueo de fila, así que la prueba simula la carrera de forma determinista y valida la revalidación, no el lock. Prefiero un comentario honesto a una prueba que aparenta garantizar más de lo que garantiza.
