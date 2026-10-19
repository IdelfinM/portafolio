---
title: The tests were pointing at the production database
project: clinica-dental
summary: The suite ignored its configured test database and connected to the real one.
result: No data was altered. The correct way to run the tests is documented, and the cause is understood rather than just worked around.
tags: [Laravel, Testing, Database, Debugging]
featured: true
order: 4
---

## Context

On the server, the application runs with Laravel's configuration and route caches (`config:cache`, `route:cache`), as recommended for production. The tests use a separate `*_testing` database.

## Problem

Running the suite on the server produced two symptoms: newly added routes didn't exist for the tests, and the suite was connected to the production database instead of the test one.

## Diagnosis

With a cached configuration, Laravel loads `bootstrap/cache/config.php` and **does not read environment variables again**. PHPUnit was passing `DB_DATABASE=..._testing`, but that value never reached the application: it used the production value stored in the cache. For the same reason, the route cache didn't know about the newly added routes.

Each test ran inside a transaction that is rolled back at the end, so no data was altered. But that detail was the only thing standing between the suite and the real data.

## Solution

For tests, the application points to cache files that don't exist, via `APP_CONFIG_CACHE` and `APP_ROUTES_CACHE`. That forces Laravel to read the real test environment configuration without touching the production caches. The full command is documented along with the reason, so nobody runs it without those variables again.

## Result

The suite runs against its own database and with the current routes. It left me with a habit: before trusting an environment variable, check which value the application is actually using.
