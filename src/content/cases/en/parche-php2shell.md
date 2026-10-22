---
title: Emergency PHP patch on release day
project: clinica-dental
summary: PHP shipped urgent fixes for two critical remote code execution flaws (PHP2Shell).
result: The application was running the fixed version the same day as the announcement, with an outage of under a second and without starting services that were stopped on purpose.
tags: [Security, Linux, PHP-FPM, Infrastructure]
order: 17
---

## Context

The application runs in production on nginx and PHP-FPM 8.4 on Ubuntu. The same server has other PHP versions installed for the command line, and services that are stopped on purpose, including Apache, which would clash with nginx on port 80.

## Problem

On October 21, 2026 the PHP project rushed out versions 8.5.12, 8.4.27 and 8.3.36, fixing **CVE-2026-109618 and CVE-2026-109619** (known as PHP2Shell): two critical flaws that allow running code on the server without logging in. The details had leaked a day earlier and there were already reports of exploitation attempts.

## Diagnosis

I confirmed the scope before touching anything:

- The server was running **PHP 8.4.26**, an affected version; the package repository already offered 8.4.27.
- I checked the official advisory and several security sources to confirm that 8.4.27 was the release fixing both flaws.
- Besides the 8.4 branch serving the application, PHP 8.3 and 8.5 were installed, plus the PHP module for Apache. According to the advisory, that module is the most exposed setup; even though Apache was off, there was no reason to leave it vulnerable.

## Solution

I upgraded **only the PHP packages** across the three branches, rather than pulling in a full system upgrade in the middle of an emergency, with two safeguards:

- **Nothing new installed:** `apt-get install --only-upgrade` with the exact list of packages that had a new version.
- **No sleeping services woken up:** a temporary `policy-rc.d` that stops packages from starting services that weren't running, plus a before/after comparison of active services to bring back anything the upgrade had left stopped.

## Result

- PHP-FPM restarted on **8.4.27**; no worker was left on the old binary, and the restart cleared OPcache.
- The site answered 200 right away and no new errors showed up in the PHP-FPM or application logs. The outage lasted under a second.
- Afterwards I refreshed the package indexes again and checked one by one that no PHP package had a pending upgrade.
- The procedure became a reusable script for the next targeted PHP patch.
