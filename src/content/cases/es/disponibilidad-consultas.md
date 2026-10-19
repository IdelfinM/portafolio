---
title: Calcular la disponibilidad con un número fijo de consultas
project: clinica-dental
summary: El motor de huecos libres podía crecer en consultas con cada odontólogo y cada cita.
result: El cálculo hace tres consultas sin importar cuántos odontólogos tenga la clínica, y una prueba congela ese número para que no vuelva a crecer.
tags: [Laravel, Rendimiento, Base de datos, Pruebas]
order: 12
---

## Contexto

Para mostrar los huecos libres hay que cruzar el horario de cada odontólogo, la duración del tratamiento y las citas que ya ocupan el sillón. Con la opción "cualquier odontólogo disponible", el cálculo cubre a todo el equipo de la clínica.

## Problema

La forma ingenua consulta el horario y las citas de cada odontólogo por separado: el clásico problema N+1. El número de consultas crece con el tamaño de la clínica, y el paciente lo dispara cada vez que cambia de día en el asistente.

## Diagnóstico

Los datos necesarios son pocos y se pueden traer agrupados en unas cuantas consultas. Lo demás es aritmética de intervalos que se puede hacer en memoria.

## Solución

- **Tres consultas** con eager loading, y el cálculo en memoria sobre una grilla de 15 minutos.
- Con "cualquier odontólogo disponible", los huecos se agrupan por hora y gana el odontólogo con menos citas ese día. El desempate es por id y no por nombre, porque el orden alfabético difiere entre MySQL y SQLite.
- **Índices compuestos** `(clinic_id, date)` y `(dentist_id, date)` para las consultas que filtran por esos campos.
- **Una prueba que cuenta las consultas** y falla si el número crece.

## Resultado

El costo por petición es constante. La prueba hace que un futuro "solo voy a cargar esta relación" no reintroduzca el N+1 sin que nadie lo note.
