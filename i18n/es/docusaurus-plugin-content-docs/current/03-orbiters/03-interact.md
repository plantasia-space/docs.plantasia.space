---
title: Interactuar
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

## Abrir un Orbitador

Los Orbitadores se abren desde un **audio**: pulsa el botón **On/Off** del Orbitador en el audio y el Orbitador se abre sobre él, incrustado en la página o en una pestaña independiente. Púlsalo otra vez para cerrarlo.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/06-use-open.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## Dimensiones

Cada Orbitador tiene hasta tres dimensiones, **I**, **II** y **III**. Cada una tiene sus propios módulos y
su propio mapeo de X, Y y Z, así que los mismos ejes hacen cosas distintas en cada una. En un ordenador,
las teclas **1**, **2** y **3** cambian entre ellas.

El transporte, el loop y el volumen son comunes a las tres. Los ejes, el Cosmic LFO y los sensores
pertenecen a la dimensión en la que estás.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/07-use-transport-jam.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>


## Transporte y bucles

Usa los controles de transporte para:

- Reproducir
- Pausar
- Detener

Abre el panel de **Reproducción** para trabajar con la forma de onda:

- Acerca o aleja
- Desplázate a otra posición
- Define regiones de loop

Los loops se mantienen disponibles en todos los paneles.

### Loops

Define un loop de tres maneras: **arrastra** una región sobre la forma de onda, elige un **tamaño de
loop** (1 compás, 4 compases…), o marca puntos de **IN** y **OUT** en el cabezal.

Un loop puede **apagarse y conserva sus marcadores**.


## Monitoreo

Los monitores muestran lo que ocurre mientras tocas: qué controles mueve cada eje ahora mismo, el audio
que suena, el Mundo Entrelazado en el que estás y el propio Orbitador.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/10-use-monitor-playback.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>


## Modo Jam (XYZ)

El modo Jam es la forma principal de interacción.

- **X** y **Y** se controlan moviéndote por la pantalla
- **Z** responde a gestos de zoom o controles dedicados

También puedes manipular los knobs directamente.

### Volver al equilibrio

- Haz doble clic / doble toque en un knob para reiniciar un eje
- Haz doble clic / doble toque en la pantalla para reiniciar X, Y y Z al mismo tiempo

El equilibrio suele representar un estado neutro o bypass.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/interact/move-axes"
  caption="En el Studio: X mueve el Amount de la One Reverb e Y el Speed del Track player, y la Screen de cada módulo los sigue. Un doble clic en X lo devuelve a su equilibrio."
  label="Con el transporte en marcha, se sube el eje X y la Screen de la One Reverb pasa a una sala; se sube y baja el eje Y y la velocidad del Track player lo sigue; un doble clic en X lo devuelve a 0, y Amount con él."
/>

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/09-use-level-num-keyboard.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## Tocar notas

Un Orbitador de notas se toca desde la <Term id="play-surface">superficie de juego</Term>, en el panel
**Playback**:

- **El piano roll** va primero: toca el instrumento de la dimensión en foco.
- **Una pestaña por cada generador** de la cadena de esa dimensión: las teclas del Arpeggiator, los pasos
  del Step sequencer, los pads del Drum sequencer.
- **El selector de <Term id="launch-grid">rejilla de lanzamiento</Term>**, junto a SYNC, hace que los
  arranques y los cambios caigan en una línea de compás.

Mira [Efectos MIDI](/docs/orbiters/midi-effects) para los generadores y
[Sincronización](/docs/orbiters/sync) para la rejilla de lanzamiento.

## Cosmic LFO

Cada eje (X, Y, Z) tiene un Cosmic LFO independiente.

Puedes controlar:

- Profundidad (intensidad de la modulación)
- Forma de onda
- Fuente de frecuencia

Algunas fuentes son manuales; otras dependen del Mundo Entrelazado y de los datos de su exoplaneta.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/08-use-cosmic-lfo.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>
