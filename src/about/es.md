Soy ingeniero de software full-stack. Trabajo sobre todo con **Laravel y Vue**, y también con **.NET** cuando el problema pide una aplicación de escritorio. No me quedo en el código: despliego, opero y mantengo lo que construyo.

Desde 2025 trabajo como desarrollador full-stack en una empresa de servicios nearshore, dentro de un equipo que mantiene su plataforma interna (Laravel, Vue y Active Directory). En paralelo construyo y opero mis propios proyectos, varios de ellos en producción con usuarios reales.

## Cómo trabajo

- **Primero entender, después cambiar.** Cuando algo falla, busco la causa con evidencia (logs, `tcpdump`, el valor real de una variable) antes de tocar código. Los casos de este sitio están escritos así a propósito.
- **Las pruebas son parte del trabajo.** Mis proyectos tienen cientos de pruebas automatizadas. Cuando una prueba no garantiza algo, el propio test lo dice.
- **Seguridad desde el diseño:** autorización explícita en cada ruta, mínimos privilegios en la base de datos, cabeceras y CSP, y auditoría de las acciones sensibles.
- **Documentar el porqué.** Cada despliegue tiene su guía y su vía de reversión, y cada decisión no obvia queda escrita junto al código.

## Infraestructura

Administro mi propio servidor Ubuntu, donde corren varias aplicaciones en producción. Unas usan nginx y PHP-FPM nativos y otras van en Docker Compose detrás de un proxy inverso con TLS. Este mismo sitio corre allí en un contenedor, y además tiene un espejo estático para estar disponible las 24 horas.

## Idiomas

Español (nativo) e inglés (intermedio, B2).
