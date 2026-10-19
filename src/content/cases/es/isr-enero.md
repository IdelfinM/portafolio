---
title: El impuesto sobre la renta en cero cada 1 de enero
project: drivebetter
summary: Un cálculo fiscal que fallaba en silencio cuando aún no existía la escala del año nuevo.
result: El cálculo nunca vuelve a dar un cero silencioso. Si falta la escala del año, usa la más reciente y lo dice con una advertencia explícita.
tags: [Laravel, Reglas de negocio, Diseño de API]
order: 16
---

## Contexto

El ISR dominicano se calcula con una escala progresiva anual. En DriveBetter esas escalas viven en la base de datos, una por año, para que un cambio de ley sea un registro nuevo y no un despliegue.

## Problema

El 1 de enero, si nadie había cargado todavía la escala del año nuevo, el servicio no encontraba tramos y **devolvía ISR = 0**. El salario neto salía inflado, sin ningún aviso. Un error así es peor que una excepción, porque nadie lo ve.

## Diagnóstico

El servicio trataba "no hay datos" como "no hay impuesto". Son cosas muy distintas, y la segunda solo debería salir de la escala misma, del tramo exento.

## Solución

- Si falta la escala del año, se usa **la más reciente disponible**, se registra en el log y la respuesta incluye la advertencia `isr_scale_year_fallback`.
- Si un salario cae en un hueco entre tramos, la advertencia es `isr_bracket_not_found`, y tampoco hay un cero silencioso.
- Otra advertencia, `base_net_not_positive`, cubre el caso en que los descuentos superan la base, en lugar de mostrar un número engañoso.

## Resultado

El API devuelve el cálculo junto con advertencias de negocio que el frontend puede mostrar. Un dato incompleto produce un aviso visible, no un resultado incorrecto.
