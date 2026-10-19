---
title: A customer name that could open the cash drawer
project: larimar
summary: Command injection into the thermal printer through invoice data.
result: A high-severity finding closed with two independent barriers, plus a test that compares the printer commands of a "poisoned" receipt with those of a clean one.
tags: [.NET, Security, Hardware, Testing]
featured: true
order: 2
---

## Context

Larimar prints receipts on 80 mm thermal printers using the ESC/POS protocol. The same channel carries both text and printer commands: cut the paper, change the font, or open the cash drawer.

## Problem

A security review surfaced this scenario: if a customer name or product description contained certain control characters, the printer would interpret them as commands. A deliberately crafted name could pop the cash drawer every time a receipt for that customer was printed.

## Diagnosis

With a single-byte code page, every control character is a potential command. User text reached the printer with nothing to tell it apart from legitimate commands. It is the same problem as SQL injection, just on paper.

## Solution

Two barriers, because each one covers a case the other doesn't:

1. **In the ESC/POS writer:** any control character in the text is replaced. It has to happen here because invoices already issued are immutable, and older ones could still carry such characters.
2. **In the domain:** names and descriptions reject control characters from the moment they are entered.

## Result

The test builds one receipt from malicious data and one from clean data, and requires the emitted commands to be identical. If someone removes either barrier, the test fails.
