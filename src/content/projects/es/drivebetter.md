---
title: DriveBetter
tagline: Finanzas personales para parejas y hogares, con un motor fiscal dominicano.
summary: App móvil de finanzas compartidas con un API en Laravel. El API calcula el salario neto según las reglas de la República Dominicana (SFS, AFP e ISR progresivo) para cualquier frecuencia de pago.
status: development
role: Desarrollo full-stack
stack: [Laravel, PHP 8.3, Sanctum, MySQL, Ionic, Angular, Capacitor, RxJS, PHPUnit]
highlights:
  - Salario neto semanal, quincenal o mensual, con incentivos en seis frecuencias distintas.
  - Descuentos de SFS y AFP, dependientes adicionales y deducciones personalizadas.
  - ISR con escala progresiva anual leída de la base de datos por año, nunca escrita en el código.
  - Advertencias de negocio explícitas en lugar de resultados silenciosamente incorrectos.
  - Hogares compartidos, con varias personas sobre las mismas finanzas.
metrics:
  - { value: '4', label: 'tramos de ISR por año, en base de datos' }
  - { value: '6', label: 'frecuencias de incentivo' }
order: 4
---

## Diseño del cálculo

Las tasas de SFS y AFP y la escala del ISR viven en tablas versionadas por año, así que un cambio de la ley es un registro nuevo y no un despliegue. Los factores de conversión entre frecuencias tienen una sola fuente de verdad, y el catálogo fiscal se cachea para no consultarlo varias veces en cada cálculo.
