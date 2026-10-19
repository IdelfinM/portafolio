---
title: Larimar
tagline: Desktop accounting and back-office system for Dominican businesses.
summary: A replacement for a legacy Visual FoxPro system, covering invoicing, inventory, receivables and payables, and accounting. Workstations never touch the database; everything goes through a central Windows service.
status: development
role: Architecture and development
stack: [C#, .NET 10, Avalonia, MVVM, ASP.NET Core, EF Core, PostgreSQL 17, xUnit, Testcontainers]
highlights:
  - Guided setup that configures the company, branch, workstation and administrator.
  - Invoices with or without a fiscal receipt number (NCF), with PDF output and 80 mm thermal receipts over network or USB.
  - Inventory ledger, accounts receivable and NCF sequence control.
  - A single .exe installer creates the database, runs migrations, creates a least-privilege role and registers the service.
  - Security log, lockout after failed attempts, and the workstation secret protected with DPAPI.
  - Command-line access recovery tool that logs who used it.
metrics:
  - { value: '417', label: 'automated tests' }
  - { value: '6', label: 'Clean Architecture projects' }
  - { value: '0', label: 'warnings allowed in the build' }
featured: true
order: 3
---

## Architecture

The solution follows Clean Architecture across six projects: Domain, Application, Infrastructure, Service, Contracts and Client. Architecture tests check that no layer depends on one it shouldn't, so the rule can't erode by accident.

Infrastructure tests start a real PostgreSQL with Testcontainers instead of an in-memory stand-in. The build treats warnings as errors and runs SonarAnalyzer.

**Next phase:** electronic invoicing (e-CF), signing the XML with a PKCS#12 certificate kept only on the server, and a submission queue to the tax authority (DGII) with retries.
