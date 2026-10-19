---
title: Wake-on-LAN that wouldn't wake the machine
project: panel-servidor
summary: The packets arrived, the network card was configured, and the server still wouldn't power on.
result: The full shutdown-and-power-on cycle was tested end to end; SSH answers about 18 seconds after the packet is sent.
tags: [Linux, Networking, Hardware, Debugging]
featured: true
order: 3
---

## Context

The panel could already shut the server down, but had no way to turn it back on: someone had to walk to the machine. I wanted to close that loop from the panel itself.

## Problem

I implemented sending the magic packet over UDP broadcast, but the machine wouldn't power on.

## Diagnosis

I ruled things out one layer at a time:

1. **Does the packet arrive?** `tcpdump` on the running server showed all three sends. The network was fine.
2. **Is the card listening?** `ethtool` showed `Wake-on: d` (disabled), and the driver left it that way on shutdown. I enabled it persistently in the network configuration (`wakeonlan: true`) and checked that it came back as `g` after a reboot.
3. **Still nothing.** That left the firmware. The BIOS had *Deep Sleep Control* set to "Enabled in S4 and S5", a power-saving option that cuts power to the network card on shutdown. A card with no power can't hear any packet.

## Solution

I disabled *Deep Sleep Control*, set *Wake on LAN* to "LAN Only", and kept the card's persistent configuration. In the panel, the "Power on" button sends the packet three times and polls over SSH every 5 seconds for up to 150 seconds, so it reports when the machine actually responds.

## Result

The full cycle is tested: shut down from the panel and power back on. The lesson: the cause was in the lowest layer, and I only got there by ruling out the layers above it with evidence.
