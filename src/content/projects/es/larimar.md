---
title: Larimar
tagline: Sistema administrativo y contable de escritorio para comercios dominicanos.
summary: Reemplazo de un sistema heredado en Visual FoxPro con facturación, inventario, cuentas por cobrar y por pagar, y contabilidad. Las estaciones de trabajo no tocan la base de datos; todo pasa por un servicio de Windows central.
status: development
role: Arquitectura y desarrollo
stack: [C#, .NET 10, Avalonia, MVVM, ASP.NET Core, EF Core, PostgreSQL 17, xUnit, Testcontainers]
highlights:
  - Asistente de puesta en marcha que configura empresa, sucursal, estación y administrador.
  - Facturas con o sin NCF, con PDF y recibo en impresora térmica de 80 mm por red o USB.
  - Kárdex de inventario, cuentas por cobrar y control de secuencias NCF.
  - Un instalador .exe crea la base de datos, migra, crea un rol de permisos mínimos y registra el servicio.
  - Bitácora de seguridad, bloqueo por intentos fallidos y secreto de estación protegido con DPAPI.
  - Herramienta de recuperación de acceso por línea de comandos, con registro de quién la usó.
metrics:
  - { value: '417', label: 'pruebas automatizadas' }
  - { value: '6', label: 'proyectos en Clean Architecture' }
  - { value: '0', label: 'warnings permitidos en el build' }
featured: true
order: 3
---

## Arquitectura

La solución sigue Clean Architecture en seis proyectos: Domain, Application, Infrastructure, Service, Contracts y Client. Unas pruebas de arquitectura comprueban que ninguna capa dependa de otra que no le corresponde, así que la regla no se rompe por descuido.

Las pruebas de infraestructura levantan un PostgreSQL real con Testcontainers en lugar de usar un sustituto en memoria. El build trata los warnings como errores y pasa por SonarAnalyzer.

**Siguiente fase:** facturación electrónica (e-CF) con firma del XML mediante certificado PKCS#12, guardado solo en el servidor, y una cola de envío a la DGII con reintentos.
