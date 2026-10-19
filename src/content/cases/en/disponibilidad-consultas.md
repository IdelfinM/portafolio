---
title: Computing availability with a fixed number of queries
project: clinica-dental
summary: The free-slot engine could grow in queries with every dentist and every appointment.
result: The calculation runs three queries no matter how many dentists the clinic has, and a test freezes that number so it can't grow again.
tags: [Laravel, Performance, Database, Testing]
order: 12
---

## Context

To show free slots, the engine has to cross each dentist's schedule, the treatment's duration and the appointments already occupying the chair. With the "any available dentist" option, the calculation covers the clinic's whole team.

## Problem

The naive approach queries each dentist's schedule and appointments separately: the classic N+1 problem. The number of queries grows with the size of the clinic, and the patient triggers it every time they change the day in the wizard.

## Diagnosis

The data needed is small and can be fetched in a few grouped queries. The rest is interval arithmetic that can be done in memory.

## Solution

- **Three queries** with eager loading, and the calculation in memory on a 15-minute grid.
- With "any available dentist", slots are grouped by time and the dentist with the fewest appointments that day wins. Ties are broken by id, not by name, because alphabetical order differs between MySQL and SQLite.
- **Composite indexes** `(clinic_id, date)` and `(dentist_id, date)` for the queries that filter on those columns.
- **A test that counts the queries** and fails if the number grows.

## Result

The cost per request is constant. The test means a future "I'll just load this one relation" can't sneak the N+1 back in unnoticed.
