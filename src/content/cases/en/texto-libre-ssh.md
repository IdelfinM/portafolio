---
title: Free text to a remote shell, without opening the door to injection
project: panel-servidor
summary: The panel needed to send messages typed by a person to a server script over SSH.
result: Tested with quotes, $( ), semicolons and accented characters. The text arrives intact and is never executed.
tags: [Security, Node.js, Linux]
order: 13
---

## Context

The panel operates the server over SSH, and its design rule is that **the browser only sends identifiers**. Commands come from a validated configuration and are never built from request data.

## Problem

A new feature had to break that rule: sending a notice freely typed by the administrator to a script on the server. Any text that reaches a shell is an invitation to injection. A single badly escaped `'; rm -rf ~ #` is enough.

## Diagnosis

Escaping quotes by hand is fragile: there are too many metacharacters and several layers of interpretation (Node, SSH and the remote shell). The safest solution was for the text to be **unable to contain** anything interpretable.

## Solution

1. Strip control characters and cap the length at 200.
2. Encode the text as **base64** in the panel.
3. On the server, decode it inside a double-quoted substitution: `"$(printf %s '<b64>' | base64 -d)"`.

Inside the single quotes only `A-Z`, `a-z`, `0-9`, `+`, `/` and `=` can appear, and none of them mean anything to the shell. The decoded text arrives as a single argument and is never evaluated.

## Result

It is the only place in the panel where free text reaches the server, and it is isolated in one shared function, so there is no second implementation that could fall behind. I tested it with the usual injection attacks and with Spanish text containing accents.
