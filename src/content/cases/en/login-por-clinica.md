---
title: One email, any clinic
project: clinica-dental
summary: In a multi-clinic platform, the login didn't know which clinic it was being accessed from.
result: Each user can only sign in through their own clinic's portal, and the response doesn't reveal which clinic an email belongs to. Covered by 13 tests.
tags: [Laravel, Security, Multi-tenant]
order: 10
---

## Context

Each clinic has its own portal: `/{clinic}/login`. Platform administration signs in through a separate entrance.

## Problem

A user from clinic A could sign in from clinic B's portal or from the generic login. Data was still isolated per clinic, but the separation between portals didn't really exist.

## Diagnosis

The authentication service looked the user up by email alone, which is unique across the platform, and never checked which URL the request came from.

## Solution

- Before any other check, the login compares the user's clinic with the clinic in the URL.
- **Same message for every rejection:** an attempt from the wrong portal gets exactly "invalid credentials", the same as a wrong password. If it said "this user doesn't belong to this clinic", anyone could find out which clinic an email belongs to by trying portals.
- Every rejection logs out and invalidates the session that was just started before responding.

## Result

The portals are truly isolated and the response leaks nothing.
