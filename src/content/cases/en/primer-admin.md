---
title: Creating the first administrator without leaving passwords anywhere
project: lab-reserva
summary: How to create accounts in production without seeders holding credentials or passwords shared over chat.
result: No credential ends up in the repository, the seeders or the history. Every new account starts with a one-time password.
tags: [Laravel, Security, Vue]
order: 15
---

## Context

In development, a seeder creates an administrator with a known password. In production that is unacceptable.

## Problem

Going live required a first administrator, and then a way to create users without the administrator knowing or sharing final passwords.

## Solution

- The administrator seeder is **skipped in production** on purpose.
- A `lab:invite-user` command generates a random temporary password, shows it **only once** in the console, and flags the account with `must_change_password`.
- A middleware blocks the whole API with a 403 `password_change_required` until the user changes it. Only their profile, logout and the password change get through.
- On the frontend, a router guard sends the user to the mandatory change screen.
- The "New user" button in the admin panel uses **the same service** as the command, so there is only one way to create accounts.

## Result

The temporary password is only good for setting the final one, and public sign-up never triggers this flow.
