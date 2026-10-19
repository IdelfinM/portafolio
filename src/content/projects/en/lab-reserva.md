---
title: Lab-Reserva
tagline: Booking for university computer labs, in production on Docker.
summary: Web system where students and teachers book a single workstation or a whole lab, and administrators manage opening hours, closures, incidents and permissions. I designed it, built it and run it in production.
status: production
role: Design, full-stack development and deployment
stack: [Laravel 12, PHP 8.4, Vue 3, Pinia, Tailwind CSS, MariaDB, Docker Compose, nginx, PHPUnit, Vitest, PHPStan]
highlights:
  - Book one workstation or a whole lab, with an approval flow, recurring series and per-role quotas.
  - Check-in with a code; no-shows lock the account. A scheduler closes expired bookings and sends reminders.
  - Opening hours, closures, holidays and academic terms per lab.
  - Lab floor plan showing each workstation's status and its installed software.
  - Full RBAC (roles, permissions, group rules and per-user exceptions) enforced on every API route.
  - Immutable activity log with the before and after of every field.
  - Invite-only sign-up with a temporary password that must be changed. Reports with CSV export.
metrics:
  - { value: '282', label: 'automated tests' }
  - { value: '103', label: 'API routes' }
  - { value: '5', label: 'containers in production' }
demoOnRequest: true
featured: true
order: 1
---

## Architecture

A Vue 3 SPA on top of a Laravel API authenticated with Sanctum. Business logic lives in services, validation in Form Requests and authorization in Policies, which keeps the controllers thin. Responses always go out through API Resources.

In production it runs in five containers: database, PHP-FPM, queue worker, scheduler and an internal nginx. A host-level nginx publishes them under a sub-path of a domain that was already serving another application. Static analysis runs with PHPStan (Larastan), with backend tests (234) and frontend tests (48).
