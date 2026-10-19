---
title: The bug that would have blocked four hours of bookings every day
project: clinica-dental
summary: While building the booking engine, I found that every night it would have treated all of the next day's slots as already past.
result: Caught and fixed before it ever reached patients. I fixed the cause in one place instead of patching every date comparison.
tags: [Laravel, Dates & time zones, Debugging]
featured: true
order: 1
---

## Context

I was building the booking engine: the wizard where patients see each dentist's free slots. One of its rules is that nobody can book in the past. The clinic operates in `America/Santo_Domingo` (UTC-4).

## Problem

Checking the "no booking in the past" rule against the real configuration revealed a four-hour window in which the system got the day wrong. Between 8:00 p.m. and midnight local time, the backend would have discarded **every** slot for the next day as already past. That is exactly when many people book from home.

## Diagnosis

`config/app.php` had a hard-coded `'timezone' => 'UTC'`. From 8:00 p.m. local time on, PHP's `now()->toDateString()` already returned tomorrow's date. The frontend, on the other hand, worked in local time, so backend and frontend disagreed about what day it was.

## Solution

I fixed the time zone at the source: `America/Santo_Domingo`. The alternative, compensating hours in every date comparison inside the engine, would have cluttered all the new code and left the trap set for the next query that touched dates.

It was the only change in that phase capable of breaking existing tests in a non-obvious way: at least one compared against `now()`. So I ran the full suite right afterwards, and it passed with no regressions.

## Result

The bug never reached production. The lesson: when a rule depends on "today", first ask which time zone "today" is in.
