Soy ingeniero de software full-stack. Mi trabajo abarca el ciclo completo: entender el requerimiento, diseñar la solución, construirla y llevarla a producción, pensando desde el inicio en cómo se va a desplegar, mantener y hacer crecer. Trabajo sobre todo con **Laravel y Vue** en la web y con **.NET** en escritorio y servicios: la plataforma la decide el problema, no al revés.

Desde 2025 trabajo como desarrollador full-stack en una empresa de servicios nearshore, dentro de un equipo que mantiene su plataforma interna (Laravel, Vue y Active Directory). En paralelo construyo y opero proyectos propios, varios de ellos en producción con usuarios reales.

## Fortalezas de ingeniería

- **Diagnóstico basado en evidencia.** La causa raíz se busca con datos antes de tocar código: logs, `tcpdump`, el valor real de una variable. Los desafíos de este sitio están contados así a propósito.
- **Confiabilidad verificable.** Los proyectos principales suman cientos de pruebas automatizadas, que corren contra bases de datos reales cuando importa, para que un cambio no rompa lo que ya funcionaba.
- **Seguridad por diseño.** Controles de acceso granulares (roles, permisos y autorización explícita en cada ruta), privilegios mínimos en la base de datos y en el sistema, CSP y cabeceras de seguridad, y auditoría inmutable de las acciones sensibles.
- **Operación lista para producción.** Cada despliegue tiene su guía y su vía de reversión, los respaldos van cifrados y los parches de seguridad urgentes no esperan: el parche de emergencia de PHP2Shell quedó aplicado el mismo día de su publicación.

## Infraestructura y operación

- **Servidores Linux:** Ubuntu con nginx, PHP-FPM y MariaDB, permisos de mínimo privilegio, servicios en systemd y actualizaciones controladas que no levantan servicios detenidos a propósito.
- **Contenedores:** aplicaciones en Docker Compose detrás de un proxy inverso con TLS, contenedores de solo lectura y publicación bajo una subruta de un dominio compartido.
- **Publicación automatizada:** este sitio se compila, se verifica y se publica en GitHub Pages en cada cambio, con una barrera que bloquea la publicación si se cuela un dato privado. Una copia corre en un contenedor Docker de solo lectura.
- **Operación remota:** un panel propio arranca y detiene servicios en el orden correcto, con health checks, y enciende el servidor por Wake-on-LAN.
- **Respaldo y recuperación:** respaldos diarios cifrados con GPG y vías de reversión documentadas para cada despliegue.

## Idiomas

Español (nativo) e inglés (intermedio, B2).
