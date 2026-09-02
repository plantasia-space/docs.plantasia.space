---
title: Sensors
wrapperClassName: doc-wrapper-icon-sensors
sidebar_position: 6
sidebar_custom_props:
  icon: Smartphone
---

Sensors let you play an Orbiter by **tilting a phone**. Tilt drives the same **X, Y, Z** controls you
would otherwise move on screen, so everything you know about dimensions, Cosmic LFO and equilibrium
still applies. This page covers what is the same everywhere first, then the cases where you play
several Orbiters at once.

## Turning a sensor on

Open the **Sensors** panel. It has one toggle per axis: **X**, **Y** and **Z**. Turn on the axes you
want the phone to move; the others stay under manual control.

<img className="ps-doc-themed-image" src="https://herbarium.plantasia.space/docs/en/media/orbiters/orbiter-sensor-panel_mid.webp" alt="The Sensors panel with the X, Y and Z toggles" />

The toggles are **per dimension**. Enabling X in dimension 1 does not enable it in dimension 2 —
switch dimension and set the toggles you want there. Switching back restores what you had.

The first time you turn a sensor on, the phone asks for permission to use motion. Accept it once.

### Calibrating

Hold the phone the way you want to play and press **Calibrate**. That position becomes the centre —
the equilibrium of X, Y and Z. Tilt away from it to move the controls, tilt back to return.

## Where the phone comes from

There are two ways to use sensors. The toggles and calibration work the same in both.

### The phone is the Orbiter

Open an Orbiter on your phone. Its own sensors drive it directly: turn on X, Y or Z in the Sensors
panel and tilt.

### The phone controls the desktop

Open an Orbiter on the desktop and press the **pair** button in the Sensors panel. Scan the QR code
with your phone. The phone opens a small controller with the same **X, Y, Z** toggles and the
**dimension** tabs; what you set there is what the desktop shows, and the other way round. Tilt the
phone and the Orbiter on the desktop moves.

<img className="ps-doc-themed-image" src="https://herbarium.plantasia.space/docs/en/media/orbiters/orbiter-sensor-connect-dialog_mid.webp" alt="The pairing dialog with the QR code" />

<img className="ps-doc-themed-image" src="https://herbarium.plantasia.space/docs/en/media/orbiters/mobile-client-sensor-chart_mid.webp" alt="The phone as a controller for the desktop" />

The pairing lasts for the session. If the phone disconnects, the desktop tells you and you can scan
again.

## Several Orbiters at once

When more than one Orbiter is open on the desktop — a collection in the multi-orbiter view, or the
home feed — each Orbiter has its **own** sensor toggles, per dimension, exactly as above. Turning X
on for one Orbiter does not turn it on for the others.

### From the desktop

Set the toggles on the Orbiter you want the phone to move. With several Orbiters selected, tilt
moves the selected ones that have that axis turned on.

### From the phone

The paired phone shows the open Orbiters as **A, B, C, D**. Tap the ones you want to play — one or
several. The phone drives only those:

<img className="ps-doc-themed-image" src="https://herbarium.plantasia.space/docs/en/media/orbiters/mobile-client_mid.webp" alt="The phone controller: Orbiters A to D, dimension tabs and the X, Y, Z toggles" />

- The **dimension** you pick on the phone switches the Orbiters you tapped, and only those.
- The **X, Y, Z** toggles on the phone turn the axis on for the Orbiters you tapped, and only those.
  The desktop shows it.
- Tilt moves the Orbiters you tapped, on their current dimension, on the axes you turned on.

Selecting Orbiters on the phone does not change what is selected on the desktop, and selecting on
the desktop does not change the phone. They are two hands on the same instrument.

With no Orbiter tapped, the phone drives nothing — tilt and toggles do nothing until you pick one.

The phone's toggles and dimension tabs describe the **first Orbiter you tapped**. Turning an axis off
on the desktop for that Orbiter turns it off on the phone too; it is the same toggle.

## Sensors only

On the phone you can **hide the controls** — the Orbiter buttons, the dimension tabs and the toggles —
to leave a clean surface for tilting. The phone remembers this choice. Show them again the same way.
