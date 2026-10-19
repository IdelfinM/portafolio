---
title: Lab-Reserva
tagline: Reservas de laboratorios de cómputo universitarios, en producción sobre Docker.
summary: Sistema web para que estudiantes y profesores reserven equipos o laboratorios completos, y para que la administración controle horarios, cierres, incidencias y permisos. Lo diseñé, lo construí y lo opero en producción.
status: production
role: Diseño, desarrollo full-stack y despliegue
stack: [Laravel 12, PHP 8.4, Vue 3, Pinia, Tailwind CSS, MariaDB, Docker Compose, nginx, PHPUnit, Vitest, PHPStan]
highlights:
  - Reserva de un equipo o del laboratorio completo, con flujo de aprobación, series recurrentes y cuotas por rol.
  - Check-in con código; las inasistencias bloquean la cuenta. Un scheduler cierra reservas vencidas y envía recordatorios.
  - Horarios de apertura, cierres, días feriados y periodos académicos por laboratorio.
  - Plano del laboratorio con el estado de cada equipo y el software instalado en él.
  - RBAC completo (roles, permisos, reglas por grupo y excepciones por usuario), aplicado en todas las rutas de la API.
  - Registro de actividad inmutable con el antes y el después de cada campo.
  - Alta por invitación con contraseña temporal de cambio obligatorio. Reportes con exportación CSV.
metrics:
  - { value: '282', label: 'pruebas automatizadas' }
  - { value: '103', label: 'rutas de API' }
  - { value: '5', label: 'contenedores en producción' }
demoOnRequest: true
featured: true
order: 1
---

## Arquitectura

Es una SPA en Vue 3 sobre una API de Laravel autenticada con Sanctum. La lógica de negocio vive en servicios, la validación en Form Requests y la autorización en Policies, con los controladores delgados. Las respuestas salen siempre por API Resources.

En producción corre en cinco contenedores: base de datos, PHP-FPM, worker de colas, scheduler y nginx interno. Un nginx del host los publica bajo una subruta de un dominio que ya servía otra aplicación. El análisis estático corre con PHPStan (Larastan), y hay pruebas de backend (234) y de frontend (48).
