I'm a full-stack software engineer. My work covers the whole cycle: understanding the requirement, designing the solution, building it and taking it to production, thinking from day one about how it will be deployed, maintained and grown. I work mostly with **Laravel and Vue** on the web and with **.NET** for desktop and services: the problem picks the platform, not the other way around.

Since 2025 I've worked as a full-stack developer at a nearshore services company, on a team that maintains its internal platform (Laravel, Vue and Active Directory). In parallel I build and run my own projects, several of them in production with real users.

## Engineering strengths

- **Evidence-based diagnosis.** The root cause is found with data before touching code: logs, `tcpdump`, the real value of a variable. The challenges on this site are written that way on purpose.
- **Verifiable reliability.** The main projects add up to hundreds of automated tests, running against real databases where it matters, so a change doesn't break what already worked.
- **Security by design.** Fine-grained access controls (roles, permissions and explicit authorization on every route), least privilege in the database and the system, CSP and security headers, and an immutable audit trail for sensitive actions.
- **Production-ready operations.** Every deployment has its guide and its rollback path, backups are encrypted, and urgent security patches don't wait: the PHP2Shell emergency patch was applied the same day it shipped.

## Infrastructure and operations

- **Linux servers:** Ubuntu with nginx, PHP-FPM and MariaDB, least-privilege permissions, systemd services, and controlled upgrades that don't start services that were stopped on purpose.
- **Containers:** applications in Docker Compose behind a TLS reverse proxy, read-only containers, and publishing under a sub-path of a shared domain.
- **Automated publishing:** this site is built, checked and published to GitHub Pages on every change, behind a gate that blocks the release if private data slips in. A copy runs in a read-only Docker container.
- **Remote operations:** an in-house panel starts and stops services in the right order, with health checks, and powers the server on with Wake-on-LAN.
- **Backup and recovery:** daily GPG-encrypted backups and documented rollback paths for every deployment.

## Languages

Spanish (native) and English (upper-intermediate, B2).
