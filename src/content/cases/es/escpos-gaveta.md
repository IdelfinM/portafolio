---
title: Un nombre de cliente que podía abrir la gaveta de dinero
project: larimar
summary: Inyección de comandos en la impresora térmica a través de los datos de una factura.
result: Hallazgo de severidad alta cerrado con dos barreras independientes y una prueba que compara los comandos de un recibo "envenenado" con los de uno limpio.
tags: [.NET, Seguridad, Hardware, Pruebas]
featured: true
order: 2
---

## Contexto

Larimar imprime recibos en impresoras térmicas de 80 mm con el protocolo ESC/POS. El mismo canal transporta el texto y los comandos de la impresora: cortar papel, cambiar la fuente o abrir la gaveta de dinero.

## Problema

En una revisión de seguridad apareció este escenario: si el nombre de un cliente o la descripción de un producto contenía ciertos caracteres de control, la impresora los interpretaba como comandos. Un nombre preparado a propósito podía abrir la gaveta cada vez que se imprimiera un recibo de ese cliente.

## Diagnóstico

Con una página de códigos de un byte, cada carácter de control es un comando potencial. El texto del usuario llegaba a la impresora sin distinguirse de los comandos legítimos. Es el mismo problema que una inyección SQL, pero en papel.

## Solución

Dos barreras, porque cada una cubre un caso que la otra no:

1. **En el escritor de ESC/POS:** sustituye cualquier carácter de control que venga en el texto. Hace falta aquí porque las facturas ya emitidas son inmutables y algunas podrían traer esos caracteres de antes.
2. **En el dominio:** los nombres y descripciones rechazan los caracteres de control desde el momento en que se capturan.

## Resultado

La prueba genera un recibo con datos maliciosos y otro con datos limpios, y exige que los comandos emitidos sean idénticos. Si alguien quita una de las dos barreras, la prueba falla.
