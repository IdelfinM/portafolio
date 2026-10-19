---
title: Two patients, one slot
project: clinica-dental
summary: Preventing two simultaneous bookings from taking the same time with the same dentist.
result: The conflict is resolved in the database, and the patient who loses the race sees the updated schedule immediately instead of a generic error.
tags: [Laravel, Concurrency, Database, Vue]
order: 8
---

## Context

The booking wizard shows the free slots and the patient picks one. Minutes can pass between seeing the list and confirming.

## Problem

Two patients may be looking at the same slot at the same time. If both confirm, the system must not create two appointments at the same time with the same dentist.

## Diagnosis

Re-checking availability on save is necessary but not enough: between that check and the `INSERT` there is a window where another request can slip in.

## Solution

- **The server never trusts what the wizard showed.** It re-validates availability on write and derives the end time from the treatment's duration, without accepting the one the client sends.
- **Database locking:** inside a transaction, `lockForUpdate()` on the `(dentist_id, date)` index. InnoDB's gap lock serializes bookings for the same dentist and day.
- **409, not 422:** a 422 means "fix your form". Here the form was valid; what changed was the schedule. The frontend recognizes the 409, goes back to the time-picking step and refreshes the slots on its own.

## Result

The rule is enforced in the layer that can actually guarantee it. There is one limitation, which I wrote down in the test itself: the suite runs on SQLite, which has no row locking, so the test simulates the race deterministically and validates the re-check, not the lock. I'd rather have an honest comment than a test that pretends to guarantee more than it does.
