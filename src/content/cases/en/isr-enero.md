---
title: Income tax at zero every January 1st
project: drivebetter
summary: A tax calculation that failed silently when the new year's scale didn't exist yet.
result: The calculation never returns a silent zero again. If the year's scale is missing, it uses the most recent one and says so with an explicit warning.
tags: [Laravel, Business rules, API design]
order: 16
---

## Context

Dominican income tax (ISR) is computed with a yearly progressive scale. In DriveBetter those scales live in the database, one per year, so a change in the law is a new record and not a deployment.

## Problem

On January 1st, if nobody had loaded the new year's scale yet, the service found no brackets and **returned ISR = 0**. Net salary came out inflated, with no warning at all. An error like that is worse than an exception, because nobody notices it.

## Diagnosis

The service treated "no data" as "no tax". Those are very different things, and the second should only ever come from the scale itself, from its exempt bracket.

## Solution

- If the year's scale is missing, the **most recent available one** is used, the fallback is logged, and the response includes the `isr_scale_year_fallback` warning.
- If a salary falls into a gap between brackets, the warning is `isr_bracket_not_found`, again with no silent zero.
- Another warning, `base_net_not_positive`, covers the case where deductions exceed the base salary, instead of showing a misleading number.

## Result

The API returns the calculation together with business warnings the frontend can display. Incomplete data produces a visible warning, not a wrong result.
