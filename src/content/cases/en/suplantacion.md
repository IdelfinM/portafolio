---
title: Seeing the app as the user sees it, without them noticing
project: clinica-dental
summary: User impersonation for support that leaves no trace on the impersonated account.
result: Support reproduces bugs with the user's exact view. The user's session stays intact, the admin panel is unreachable while impersonating, and the audit log records everything.
tags: [Laravel, Security, Sessions, Vue]
order: 9
---

## Context

When a user reports "I can't see such-and-such", the fastest way to understand it is to see the application exactly as they do, with their role, their clinic and their data.

## Problem

The main requirement was that impersonation be **invisible to the impersonated user**:

- No changes to their password or profile.
- No emails sent to them.
- No sessions closed on their other devices.

And when done, the administrator had to get back to their own account without getting stuck.

## Diagnosis

Every shortcut broke something:

- **A separate token** doesn't go through the same middleware as the real session, so it doesn't show the exact view.
- **`logout()`** rotates the user's `remember_token` and logs them out on their other devices.
- **An exit route inside `/admin`** would return 403 while impersonating, leaving the session stuck.

## Solution

- The identity switch happens on the same cookie session. On exit, `logoutCurrentDevice()` is used, not `logout()`.
- The route to stop impersonating lives outside the admin group.
- Another SuperAdmin can't be impersonated, and impersonations can't be chained.
- A middleware blocks actions that would leave a trace on the impersonated account.
- On exit, the page fully reloads so no user data remains in the Pinia stores.
- A fixed banner shows at all times that impersonation is active.

## Result

Impersonation is a safe support tool. A test locks in that `/admin/*` is unreachable while it lasts. The audit log does record everything the impersonator does, and that is intentional.
