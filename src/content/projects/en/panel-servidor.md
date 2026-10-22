---
title: Server control panel
tagline: In-house tool to operate a Linux server over SSH, with zero external dependencies.
summary: A desktop panel to power on, shut down and monitor the services of an Ubuntu server from another machine on the network. It is a Node.js HTTP server without a single npm package, opened as a browser app window.
status: production
role: Design and development
stack: [Node.js, JavaScript, HTML, CSS, SSH, systemd, Docker Compose, Linux]
highlights:
  - Cards per group of systemd services, with start order, reverse stop order and an HTTP health check.
  - Shut down, reboot and power-on buttons for the machine; power-on uses Wake-on-LAN.
  - Persistent switches that tell what is configured apart from what is actually running, and flag a pending restart.
  - New applications, machines and queries are added by editing a JSON file validated at startup, with no code changes.
  - Session with an HMAC-signed cookie, scrypt-hashed password and login attempt limits.
metrics:
  - { value: '0', label: 'npm dependencies' }
  - { value: '~18 s', label: 'from WoL packet to SSH available' }
order: 5
---

## Why it exists

Several applications share one server: one on native PHP, one in Docker and a few custom services. Stopping or starting each one has an order that matters: the database before PHP-FPM, and PHP-FPM before nginx. The panel holds that knowledge so that operating the server doesn't depend on remembering commands.

It lives outside the server on purpose: if the server misbehaves, the panel is still there to bring it back.
