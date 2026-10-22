---
title: Plataforma de citas odontológicas
tagline: SaaS multiclínica de agenda y expedientes, en uso por una clínica real.
summary: Plataforma donde cada clínica tiene su propio portal, su agenda y sus pacientes. Los pacientes reservan solos en un asistente de cuatro pasos y la clínica lleva el expediente clínico y financiero. Desarrollo, despliegue y mantenimiento en producción de punta a punta, sobre una infraestructura Linux con privilegios mínimos.
status: production
role: Desarrollo full-stack, infraestructura y soporte
stack: [Laravel 13, PHP 8.4, Vue 3, Vuetify, Pinia, MariaDB, nginx, PHP-FPM, Ubuntu, PHPUnit]
highlights:
  - Portal aislado por clínica (/{clínica}/login) y un acceso aparte para la administración de la plataforma.
  - Cuatro roles (SuperAdmin, administrador de clínica, odontólogo y paciente), con middlewares por rol en la API y guards en el router.
  - Agenda general y personal en vista de día, semana y dos semanas, con máquina de estados para las citas.
  - Motor de disponibilidad con la opción "cualquier odontólogo disponible", y agendamiento asistido desde recepción.
  - Expediente clínico (notas) y financiero (cargos, abonos, saldo). Pacientes de mostrador sin correo que luego se vinculan con un código de invitación.
  - Panel de plataforma con alta de clínicas, suspensión, borrado lógico con restauración, suplantación de usuarios y bitácora de auditoría.
  - Respaldos diarios cifrados con GPG.
metrics:
  - { value: '600+', label: 'pruebas automatizadas' }
  - { value: '4', label: 'roles con permisos propios' }
  - { value: '3', label: 'consultas para calcular la disponibilidad' }
demoOnRequest: true
featured: true
order: 2
---

## Notas

La clínica que la usa no se nombra aquí y ninguna captura contiene datos reales de pacientes. La demostración se hace con datos ficticios.

## Seguridad y operación

Controles de acceso granulares por rol en la API y en el router, MariaDB con un usuario de privilegios mínimos (solo lectura y escritura de datos, sin permisos sobre el esquema), certificados TLS, cabeceras de seguridad, rate limiting en los endpoints de autenticación y respaldos diarios cifrados. La aplicación se sirve con nginx y PHP-FPM, y los parches de seguridad urgentes se aplican el mismo día de su publicación.
