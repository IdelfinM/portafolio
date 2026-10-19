---
title: Defense in depth for exposing an application to the Internet
project: lab-reserva
summary: What stands between the Internet and the Laravel code, and why each layer is there.
result: Each layer covers a different failure, and every release has a rollback path prepared before it starts.
tags: [Docker, nginx, Security, Infrastructure]
order: 14
---

## Context

Lab-Reserva went public on the Internet, on a server shared with another production application.

## Problem

The framework comes with protections (CSRF, throttling, validation), but relying on them alone means any application bug is directly exposed.

## Solution

**Network and containers**
- Only the internal nginx publishes a port, and only on `127.0.0.1`. The database publishes none.
- `no-new-privileges` on every container, and kernel capabilities reduced to the minimum.

**Host nginx, before reaching PHP**
- Rate limit of 10 requests per minute per IP on login, registration and password recovery.
- HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- **CSP in blocking mode** with `script-src 'self'`.

**Application**
- `APP_DEBUG=false`. `.env` and `.git` return 403 even though they sit outside `public/`.
- nginx and PHP versions hidden.

**Operations**
- Before every release: a database dump, a copy of the code, and `rollback-YYYYMMDD` tags on the Docker images. Rolling back means switching tags, not rebuilding.

## Result

If one layer fails, the next one still stands. And a bad release can be rolled back in minutes.
