---
title: Wake-on-LAN que no despertaba el equipo
project: panel-servidor
summary: Los paquetes llegaban, la tarjeta de red estaba configurada, y aun así el servidor no encendía.
result: Ciclo apagar-encender probado de punta a punta; SSH responde unos 18 segundos después de enviar el paquete.
tags: [Linux, Redes, Hardware, Depuración]
featured: true
order: 3
---

## Contexto

El panel ya podía apagar el servidor, pero no tenía forma de volver a encenderlo: había que ir hasta la máquina. Quería cerrar ese ciclo desde el propio panel.

## Problema

Implementé el envío del paquete mágico por UDP broadcast, pero el equipo no encendía.

## Diagnóstico

Fui descartando capa por capa:

1. **¿Llega el paquete?** Con `tcpdump` en el servidor encendido se veían los tres envíos. La red estaba bien.
2. **¿La tarjeta escucha?** `ethtool` mostraba `Wake-on: d` (desactivado). El driver la dejaba así al apagar. La activé de forma persistente en la configuración de red (`wakeonlan: true`) y comprobé que volvía en `g` tras reiniciar.
3. **Seguía sin encender.** Quedaba el firmware. La BIOS tenía *Deep Sleep Control* en "Enabled in S4 and S5", una opción de ahorro que corta la corriente de la tarjeta de red al apagar. Una tarjeta sin corriente no puede escuchar ningún paquete.

## Solución

Desactivé *Deep Sleep Control*, dejé *Wake on LAN* en "LAN Only" y mantuve la configuración persistente de la tarjeta. En el panel, el botón "Encender" envía el paquete tres veces y sondea por SSH cada 5 segundos hasta 150 segundos, para avisar cuando el equipo de verdad responde.

## Resultado

Ciclo completo probado: apagar desde el panel y volver a encender. La lección: la causa estaba en la capa más baja, y solo llegué a ella descartando con evidencia las capas de arriba.
