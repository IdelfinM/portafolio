---
title: Why the cash registers don't connect to the database
project: larimar
summary: Larimar's most important architectural decision, with the alternatives that were ruled out and why.
result: Tax rules and receipt numbering live in one place, the certificate never touches a register, and an update is installed on a single machine.
tags: [.NET, Architecture, PostgreSQL]
order: 11
---

## Context

The legacy system connected every workstation directly to the database. In a store with several registers, that means business logic and database credentials are repeated on every machine.

## Problem

Some rules can't fail:

- **Fiscal receipt numbers (NCF) can't be duplicated or skipped.**
- **The digital certificate** for electronic invoicing must not leave the server.

With direct connections, every register would have to enforce the rules on its own and have access to everything.

## Diagnosis

The question wasn't which technology to use, but where each responsibility lives. If numbering is assigned in one place, it can't be duplicated. If only one process holds the connection string, stealing a register doesn't give access to the database.

## Solution

A **Windows service built on ASP.NET Core** is the only thing that talks to PostgreSQL, and the only thing holding the connection string and the certificate. The Avalonia desktop clients only talk to that service, through a shared contracts project.

Alternatives ruled out, each for a concrete reason:

- **Electron / Tauri:** dot-matrix printing and large data grids.
- **WPF:** in maintenance mode and tied to Windows.
- **SQL Server Express:** size cap and licensing.
- **SQLite:** can't handle concurrency from several registers.
- **Cloud only:** every Internet outage would stop invoicing.

## Result

Architecture tests make sure no layer depends on one it shouldn't, so the decision doesn't erode over time. A business update is installed on the server, not on every register.
