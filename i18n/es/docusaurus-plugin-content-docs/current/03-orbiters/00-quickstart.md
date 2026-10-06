---
title: Tu primer Orbitador en 5 minutos
sidebar_label: Primeros pasos
description: Construye un Orbitador desde cero — un instrumento, un efecto, mapeado a un eje — y tócalo.
sidebar_position: 1.5
hide_table_of_contents: true
sidebar_custom_props:
  icon: Rocket
---

En cinco minutos vas a construir un pequeño Orbitador de Audio: un reproductor para un audio que eliges, una reverb y un <Term id="axis">eje</Term> que sube la reverb al moverlo. Después lo tocas y lo publicas. Necesitas haber iniciado sesión en Plantasia Space.

Algunos nombres del Studio (módulos, **Map**, **Mappings**) aparecen en inglés en la aplicación; aquí se escriben igual que en pantalla.

<StepFlow
  groups={[
    { label: 'Menú Publicar', steps: [{ n: 1, label: 'Nuevo Orbitador', href: '#start' }] },
    { label: 'Paso Instrumento', steps: [
      { n: 2, label: 'Elige qué toca', href: '#instrument' },
      { n: 3, label: 'Añade un efecto', href: '#effect' },
      { n: 4, label: 'Mapéalo a un eje', href: '#map' },
      { n: 5, label: 'Tócalo', href: '#play' },
    ] },
    { label: 'Paso Visual', steps: [{ n: 6, label: 'Elige su aspecto', href: '#visual' }] },
    { label: 'Paso Publicar', steps: [{ n: 7, label: 'Publícalo', href: '#release' }] },
  ]}
/>

<Walkthrough>

## 1. Empieza un Orbitador nuevo {#start}

Abre **Publicar → Nuevo Orbitador**. El Orbiter Studio se abre en su primer paso, **Instrumento**: el Orbitador en su escenario arriba y, debajo, el rack donde lo construyes. Los otros dos pasos, **Visual** y **Publicar**, vienen después.

![El menú Publicar con Nuevo Orbitador.](/img/orbiters/release/new.es.png)

## 2. Elige qué toca {#instrument}

El rack vacío pregunta **¿Qué toca este Orbiter?** Elige **Audio**: el Orbitador toca un audio que eliges.

![¿Qué toca este Orbiter? Audio o Notas.](/img/orbiters/quickstart/choose-audio-or-notes.jpg)

Pulsa el hueco vacío **Instrument** y elige el **Track player**.

![El hueco Instrument vacío del Mundo I, con Track player y Granular en Modules that fit here.](/img/orbiters/quickstart/instrument-picker.jpg)

Pulsa **Elegir audio de vista previa** en la cabecera del Track player y elige un audio. Es solo lo que escuchas mientras construyes: más adelante el Orbitador puede tocar cualquier audio.

:::note

**Notas** construye en su lugar un Orbitador que toca notas, con un sintetizador o el Sampler. Mira [Instrumentos](/docs/orbiters/instruments) para ver la diferencia.

:::

## 3. Añade un efecto {#effect}

Pulsa el hueco **Audio effect** después del Track player. En **One — one-knob modules**, elige **Reverb**: la One Reverb, una reverb entera en una sola perilla, **Amount**. Va en el Mundo I, después del reproductor.

![El rack del Mundo I: Mappings, el Track player y después la One Reverb.](/img/orbiters/quickstart/rack-with-effect.jpg)

Se carga con Amount en 0 %, así que todavía no oyes ningún cambio: mira [Efectos de audio](/docs/orbiters/audio-effects).

## 4. Mapéalo a un eje {#map}

1. Pulsa **Map** en la columna **Mappings**. El eje **X** del escenario se pone rojo: es el eje que estás mapeando. Toca **Y** o **Z** en el escenario para mapear uno de esos.
2. Cada control del rack muestra ahora una etiqueta **map**. Pulsa la de **Amount** de la One Reverb.

El mapeo aparece en la columna como **X · Amount**, con tres valores: **min** (−70 %), **<Term id="equilibrium">equil</Term>** (0 %) y **max** (70 %). Con el eje en reposo, Amount queda en su equilibrio, 0 %: sin reverb. Al mover X hacia un lado entra la sala de la One Reverb; hacia el otro, su placa.

![Modo Map: el eje X en rojo en el escenario, X · Amount en la columna Mappings con min, equil y max, y el Amount de la One Reverb mapeado a X.](/img/orbiters/quickstart/map-to-x.jpg)

Pulsa **Mapping…** para salir del modo Map.

## 5. Tócalo {#play}

Pulsa **Reproducir** arriba del escenario y arrastra el eje **X** hacia arriba. El eje lleva ahora el nombre de lo que mueve, **Amount**, y la One Reverb lo sigue: el sonido pasa de seco a una habitación y, más arriba, a una sala. Arrástralo hacia abajo para la placa.

![Tocando: X en 50.6 ha llevado el Amount de la One Reverb a 20 %, Room.](/img/orbiters/quickstart/play-x.jpg)

## 6. Elige su aspecto {#visual}

Abre el paso **Visual**. Todo tiene ya un aspecto diseñado, así que puedes dejarlo como está y seguir, o cambiarlo:

- **Panel** (2D): los controles del Orbitador en pantalla. Elige un **Theme**, o sus propias fuentes y colores.
- **Ring** (3D): el anillo alrededor del Orbitador, su color y su forma (**Amplitude**, **Radius**, **Tilt**).
- **Devices**: lo que muestra cada módulo en el panel, su **Screen**, o su **Mapping** mientras un eje lo mueve.

El Panel y el Ring empiezan **Tied · all bodies**: un mismo aspecto para todo el Orbitador.

![El paso Visual: el tema, las fuentes y los colores del Panel, el color y la forma del Ring, y el Track player en Devices.](/img/orbiters/quickstart/visual-step.jpg)

## 7. Publícalo {#release}

Abre el paso **Publicar**: dale al Orbitador una portada y un **Nombre del Orbiter**, elige quién puede verlo y pulsa **Publicar Orbiter**. Hasta entonces, tu trabajo se guarda solo como borrador. Mira [Publicar](/docs/orbiters/release) y [Editar](/docs/orbiters/edit).

</Walkthrough>

## Siguiente

- **Más instrumentos**: el [Sampler](/docs/orbiters/instruments/sampler), o un Orbitador de Notas con [hasta tres instrumentos](/docs/orbiters/instruments/multiple-midi-instruments).
- **Más efectos**: dónde puede ir un efecto, una dimensión de Mundo, la Estrella o una Luna, en [Efectos de audio](/docs/orbiters/audio-effects).
- **Más formas de tocar**: [sincroniza](/docs/orbiters/sync) varios Orbitadores con un mismo tempo, o inclina un teléfono con los [Sensores](/docs/orbiters/sensors).
