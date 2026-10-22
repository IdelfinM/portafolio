---
title: Dental appointment platform
tagline: Multi-clinic scheduling and records SaaS, used by a real clinic.
summary: A platform where each clinic has its own portal, schedule and patients. Patients book on their own through a four-step wizard, and the clinic keeps clinical and financial records. Built, deployed and maintained in production end to end, on a least-privilege Linux infrastructure.
status: production
role: Full-stack development, infrastructure and support
stack: [Laravel 13, PHP 8.4, Vue 3, Vuetify, Pinia, MariaDB, nginx, PHP-FPM, Ubuntu, PHPUnit]
highlights:
  - An isolated portal per clinic (/{clinic}/login) and a separate entrance for platform administration.
  - Four roles (SuperAdmin, clinic admin, dentist and patient), with per-role middleware in the API and guards in the router.
  - General and personal schedules in day, week and two-week views, with a state machine for appointments.
  - Availability engine with an "any available dentist" option, plus assisted booking from the front desk.
  - Clinical records (notes) and financial records (charges, payments, balance). Walk-in patients without an email can be linked later with an invitation code.
  - Platform panel to onboard clinics, suspend them, soft-delete and restore, impersonate users, and review the audit log.
  - Daily GPG-encrypted backups.
metrics:
  - { value: '600+', label: 'automated tests' }
  - { value: '4', label: 'roles with their own permissions' }
  - { value: '3', label: 'queries to compute availability' }
demoOnRequest: true
featured: true
order: 2
---

## Notes

The clinic using it is not named here, and no screenshot contains real patient data. Demos use made-up data.

## Security and operations

Fine-grained, role-based access controls in the API and the router, MariaDB with a least-privilege user (data read and write only, no schema permissions), TLS certificates, security headers, rate limiting on the authentication endpoints, and daily encrypted backups. The application is served with nginx and PHP-FPM, and urgent security patches are applied the same day they ship.
