---
title: El bug que habría bloqueado cuatro horas diarias de reservas
project: clinica-dental
summary: Construyendo el motor de reservas, descubrí que cada noche habría dado por pasados todos los huecos del día siguiente.
result: Detectado y corregido antes de llegar a los pacientes. Arreglé la causa en un solo lugar, en vez de parchear cada comparación de fechas.
tags: [Laravel, Fechas y zonas horarias, Depuración]
featured: true
order: 1
---

## Contexto

Estaba construyendo el motor de reservas: el asistente donde el paciente ve los huecos libres de cada odontólogo. Una de sus reglas es que nadie puede reservar en el pasado. La clínica opera en `America/Santo_Domingo` (UTC-4).

## Problema

Al razonar la regla "no reservar en el pasado" contra la configuración real, apareció una franja de cuatro horas en la que el sistema se equivocaba de día. Entre las 8:00 p. m. y la medianoche, hora local, el backend habría descartado como pasados **todos** los huecos del día siguiente. Es justo la franja en que mucha gente reserva desde casa.

## Diagnóstico

`config/app.php` tenía `'timezone' => 'UTC'` fijo. A partir de las 8:00 p. m. locales, `now()->toDateString()` en PHP ya devolvía la fecha de mañana. El frontend, en cambio, sí trabajaba en hora local, así que backend y frontend no coincidían sobre qué día era.

## Solución

Corregí la zona horaria en el origen: `America/Santo_Domingo`. La alternativa, compensar las horas en cada comparación de fechas del motor, habría ensuciado todo el código nuevo y dejado la trampa armada para la próxima consulta con fechas.

Era el único cambio de esa fase capaz de romper pruebas existentes de forma no obvia: al menos una comparaba contra `now()`. Por eso corrí la suite completa justo después, y pasó sin regresiones.

## Resultado

El fallo nunca llegó a producción. La lección: cuando una regla depende de "hoy", conviene preguntarse primero en qué zona horaria es "hoy".
