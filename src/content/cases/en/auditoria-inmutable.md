---
title: An activity log the application itself cannot alter
project: lab-reserva
summary: Full traceability of who did what, including actions that don't go through any model.
result: Every change is stored with its before and after, the IP and the browser. It is covered by 13 backend tests and one frontend test, and the limits of the guarantee are documented.
tags: [Laravel, Security, Auditing, Vue]
order: 7
---

## Context

Administrators needed to answer questions like "who changed this permission?" or "who exported this data?". There was no record at all.

## Problem

The obvious move was to hook into Eloquent events (created, updated, deleted). But several of the most sensitive actions **are not model changes**: logging in, a failed login, logging out, syncing permissions or exporting a report.

## Diagnosis

Two sources were needed:

- An observer for data changes.
- Explicit events where there is no model.

And an audit log is only worth something if nobody can edit it from the application, not even an administrator.

## Solution

- **`ActivityObserver`** records the before and after, field by field. Sensitive values (passwords, tokens) are stored as `[oculto]` ("hidden").
- **Explicit events** for login, failed login, logout, syncs, scheduled tasks and exports.
- **Immutability in the model:** any attempt to update or delete a row throws an exception, and the API only exposes a read route.
- **Access restricted** to the base administrator role. It is a permission that cannot be granted through RBAC, so nobody can grant it to themselves.

## Result

The log is in production and is kept forever, by decision of the system owner. I documented the limit honestly: immutability is enforced by the application, and someone with direct database access could still delete rows.
