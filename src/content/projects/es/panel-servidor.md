---
title: Panel de control del servidor
tagline: Herramienta propia para operar un servidor Linux por SSH, sin dependencias externas.
summary: Panel de escritorio para encender, apagar y supervisar los servicios de un servidor Ubuntu desde otra máquina de la red. Es un servidor HTTP en Node.js sin ningún paquete npm, que se abre como ventana de aplicación del navegador.
status: production
role: Diseño y desarrollo
stack: [Node.js, JavaScript, HTML, CSS, SSH, systemd, Docker Compose, Linux]
highlights:
  - Tarjetas por grupo de servicios systemd, con orden de arranque, parada en orden inverso y health check HTTP.
  - Botones de apagar, reiniciar y encender el equipo; el encendido usa Wake-on-LAN.
  - Interruptores persistentes que distinguen lo configurado de lo que está corriendo y avisan si falta un reinicio.
  - Aplicaciones, máquinas y consultas nuevas se agregan editando un JSON que se valida al arrancar, sin tocar código.
  - Sesión con cookie firmada por HMAC, contraseña con scrypt y límite de intentos.
metrics:
  - { value: '0', label: 'dependencias npm' }
  - { value: '~18 s', label: 'del paquete WoL a SSH disponible' }
order: 5
---

## Por qué existe

Varias aplicaciones comparten un mismo servidor: una de PHP nativo, otra en Docker y algunos servicios propios. Apagar o levantar cada una tiene un orden que importa: la base de datos antes que PHP-FPM, y PHP-FPM antes que nginx. El panel guarda ese conocimiento para que operar el servidor no dependa de recordar comandos.

Vive fuera del servidor a propósito: si el servidor se comporta raro, el panel sigue disponible para levantarlo.
