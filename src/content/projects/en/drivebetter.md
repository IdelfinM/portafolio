---
title: DriveBetter
tagline: Personal finance for couples and households, with a Dominican tax engine.
summary: A shared-finance mobile app with a Laravel API. The API computes net salary under Dominican Republic rules (SFS, AFP and progressive income tax) for any pay frequency.
status: development
role: Full-stack development
stack: [Laravel, PHP 8.3, Sanctum, MySQL, Ionic, Angular, Capacitor, RxJS, PHPUnit]
highlights:
  - Weekly, biweekly or monthly net salary, with incentives in six different frequencies.
  - SFS and AFP deductions, additional dependents and custom deductions.
  - Income tax from a yearly progressive scale stored in the database, never hard-coded.
  - Explicit business warnings instead of silently wrong results.
  - Shared households, with several people on the same finances.
metrics:
  - { value: '4', label: 'income tax brackets per year, in the database' }
  - { value: '6', label: 'incentive frequencies' }
order: 4
---

## Calculation design

SFS and AFP rates and the income tax scale live in tables versioned by year, so a change in the law is a new record and not a deployment. The conversion factors between pay frequencies have a single source of truth, and the tax catalog is cached so it is not queried several times per calculation.
