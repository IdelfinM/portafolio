---
title: One slow request froze the whole site
project: clinica-dental
summary: The production application was being served by a single PHP process.
result: The site now handles requests in parallel with nginx and PHP-FPM, and the previous setup was kept ready as a rollback path.
tags: [Linux, nginx, PHP-FPM, Performance, Infrastructure]
order: 6
---

## Context

Early on, the application ran on `php artisan serve` behind nginx as a proxy, under a systemd service.

## Problem

When one request was slow, every other request queued up behind it: a single slow operation froze the site for every user.

## Diagnosis

`artisan serve` is PHP's development server: **one process handling one request at a time**. It wasn't a code problem; it was how the application was being served.

## Solution

I migrated to the standard production setup: nginx serves `public/` directly and hands PHP to **PHP-FPM** over a socket, with a pool of workers. The migration brought operational tasks that I documented:

- **OPcache is on:** after deploying code, PHP-FPM has to be reloaded.
- **Configuration, route and view caches** are rebuilt on every deployment.
- **Permissions:** `user:www-data` ownership with the minimum required, and an ACL so `www-data` can traverse the home directory without opening it to the group.

The old service was stopped and disabled, but not deleted, as a rollback path. The server control panel refuses to start it, since it would compete with nginx.

## Result

Requests are handled in parallel, and a slow operation no longer blocks everyone else.
