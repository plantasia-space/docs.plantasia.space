---
title: Cookie Guide
sidebar_position: 70
sidebar_custom_props:
  icon: Cookie
---

## How We Use Cookies

**The most important thing to know: we use only first-party cookies. We don't use third-party cookies.**

We currently use one cookie category on this site:

### The Essentials (Necessary)

Just like a plant needs roots, our platform needs these cookies to survive. They are always active and cannot be turned off because the site would break without them.

*   **What they do:** They handle secure sessions, basic site security, and consent preferences.
*   **Your experience:** You won't notice them, but they are working in the background to keep your account safe and your transactions secure.

Across the wider Plantasia Space platform, the strictly necessary services are:

*   **Authentication** — Firebase securely manages your account and login state
*   **Payments** — Stripe handles billing and payment flows
*   **Security** — Cloudflare Turnstile prevents bot abuse and keeps the platform safe

## What We Don't Use

We do not use third-party cookies. We also do not use analytics cookies, advertising identifiers, localStorage visitor IDs, third-party analytics providers, or tracking pixels.

To understand platform health, we use **first-party anonymous telemetry** instead: a session identifier stored only in `sessionStorage` groups events within your current browser tab, and IP addresses are truncated and processed with a daily rotating salt — so activity cannot be linked back to you or tracked across days.

We also honor **Do Not Track** and **Global Privacy Control (GPC)** signals: if enabled, non-essential event collection is disabled automatically.

## One Category, Always On

Because everything we use is strictly necessary and first-party, there is nothing to opt in or out of:

> **NECESSARY** — Login/session and security for the site, plus Stripe checkout and billing to process payments and help prevent fraud. Always on.
