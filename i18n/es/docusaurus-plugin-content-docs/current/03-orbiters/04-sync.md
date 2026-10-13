---
title: Sincronización
wrapperClassName: doc-wrapper-icon-sync
sidebar_position: 5
sidebar_custom_props:
  icon: Repeat
---

Sync permite que los Orbitadores suenen **juntos con un tempo compartido**: varios Orbitadores en la misma pantalla, o Orbitadores abiertos por distintas personas en la misma sesión. Actívalo y se fijan al mismo pulso; cambia el tempo desde cualquiera de ellos y los demás lo siguen.

<figure className="ps-doc-themed-figure">
  <img
    className="ps-doc-themed-image ps-doc-themed-image--light"
    src="/img/orbiters/sync/sync-shared-tempo-es-light.svg"
    alt="Dos Orbitadores sincronizados conectados a un único reloj de tempo compartido"
  />
  <img
    className="ps-doc-themed-image ps-doc-themed-image--dark"
    src="/img/orbiters/sync/sync-shared-tempo-es-dark.svg"
    alt="Dos Orbitadores sincronizados conectados a un único reloj de tempo compartido"
  />
</figure>

## Activar Sync

Cada Orbitador tiene un botón **SYNC**.

- Activa SYNC para unirte al tempo compartido.
- La insignia junto a SYNC muestra cuántos están sonando juntos.
- Desactiva SYNC y el Orbitador vuelve a sonar por su cuenta.

Quién define el tempo sigue una regla simple:

- El **primer** Orbitador que activa SYNC **arranca la sesión con su propio tempo**.
- Quien se sincroniza **después** **adopta el tempo que ya está en marcha**: no tienes que ajustarlo manualmente, y unirte nunca impone tu velocidad a los demás.
- Al desactivar SYNC **conservas el tempo actual**: el Orbitador sigue a la velocidad a la que estaba sonando, nunca salta a un valor anterior. A partir de ahí el tempo vuelve a ser tuyo.

## Cada reproductor tiene un tempo

El **número de BPM de cada Orbitador es el tempo de ese reproductor**. Lo que significa depende de SYNC:

- **Sincronizado**: el número **es el tempo compartido**, un único reloj compartido para todos. Cámbialo **de cualquier forma** (escribe un nuevo BPM, usa el control de velocidad en un Orbitador sincronizado o envía MIDI) y **todos los Orbitadores sincronizados lo siguen**.
- **No sincronizado**: el número es **el tempo propio de ese reproductor**. Cámbialo y solo ese Orbitador cambia de velocidad (con Warp activado lo oyes estirarse, como un fader de pitch); nunca mueve el tempo compartido ni a ningún otro reproductor.
- El cambio **se mantiene**: un tempo solo se mueve cuando lo cambias deliberadamente. Cargar otro Orbitador en la sesión nunca cambia un tempo que ya está sonando.

## Warp: seguir el tempo o sonar libre

Cada Orbitador tiene un interruptor **Warp** (activado por defecto) en el panel Playback.

Warp significa **seguir el tempo**: el compartido cuando está sincronizado, el número de BPM propio del
Orbitador cuando no. Con Warp desactivado, el Orbitador suena a su velocidad natural de grabación.

| Tu Orbitador | Qué escuchas |
|---|---|
| SYNC desactivado · Warp activado | Sigue su **propio** número de BPM: cámbialo y el audio se estira |
| SYNC desactivado · Warp desactivado | Suena a su velocidad natural de grabación |
| SYNC activado · Warp activado | Sigue el tempo **compartido**, estirado para fijarse con todos |
| SYNC activado · Warp desactivado | Permanece en la sesión, pero suena a su velocidad natural |

<figure className="ps-doc-themed-figure">
  <img
    className="ps-doc-themed-image ps-doc-themed-image--light"
    src="/img/orbiters/sync/sync-warp-states-es-light.svg"
    alt="Cuatro estados de Sync y Warp: sin sincronizar con warp activado o desactivado, y sincronizado con warp activado o desactivado"
  />
  <img
    className="ps-doc-themed-image ps-doc-themed-image--dark"
    src="/img/orbiters/sync/sync-warp-states-es-dark.svg"
    alt="Cuatro estados de Sync y Warp: sin sincronizar con warp activado o desactivado, y sincronizado con warp activado o desactivado"
  />
</figure>

## Rejilla de lanzamiento: arranca y salta en el compás

Junto a SYNC, cada Orbitador tiene un selector de **rejilla de lanzamiento** (**Ninguna** por defecto). Elige una rejilla (1 compás, 4 compases…) y los arranques y saltos de ese reproductor caen **en el pulso**:

- **Play** entra en una línea de compás: un reproductor **sincronizado** espera al siguiente compás compartido (ves la cuenta atrás); uno **sin sincronizar** (con Warp activado) arranca justo en la línea de compás propia más cercana.
- **Mover el cabezal mientras suena** no salta de inmediato: espera y aterriza en el siguiente compás, para que el groove nunca tropiece. La cuenta atrás muestra cuándo.
- La rejilla es **por reproductor**: cada Orbitador conserva la suya. Para ajustar varias a la vez, **selecciónalos juntos** y elige una rejilla: todos los reproductores enfocados la adoptan.
- Ponla en **Ninguna** y todo vuelve a ser inmediato.

## Velocidad vs tono

El control de velocidad del Orbitador funciona en **Velocidad (%)** o en **Tono (semitonos)**. Los
semitonos mueven la velocidad más que un porcentaje, así que un pequeño movimiento puede cambiar mucho
el BPM (una octava arriba es el doble de velocidad). Si un cambio de velocidad se siente mayor de lo
esperado, probablemente estás en modo tono.

## Misma pantalla vs distintas personas

- **Misma pantalla**: varios Orbitadores abiertos juntos se fijan sin configuración; solo activa SYNC.
- **Distintas personas / ventanas**: unirse a la misma <Term id="room">sala</Term> permite que todos compartan un tempo entre dispositivos. Activa SYNC después de unirte y adoptas el tempo de la sala.
