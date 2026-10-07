---
title: Interactuar
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

## Abrir un Orbitador

Accede a los Orbitadores desde el **Audio** que estás escuchando.

Dependiendo del contexto, el Orbitador puede abrirse incrustado en la página o en una pestaña independiente.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/06-use-open.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## Comenzar por las dimensiones

Cada Orbitador incluye **tres dimensiones**.

Cada dimensión contiene un conjunto distinto de transformaciones diseñadas por la persona creadora del Orbitador.

Los mismos controles **X, Y, Z** activan procesos diferentes en cada dimensión.

En escritorio puedes cambiar de dimensión con las teclas **1 / 2 / 3**.

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

- Los tamaños predefinidos crean el loop hacia delante desde el loop en el que estás — o **desde el
  cabezal** cuando el loop está apagado o estás fuera de él.
- **IN y OUT son independientes.** Con un loop ya definido, marcar un nuevo IN mueve el loop al
  momento, conservando el OUT anterior. Un IN más allá del OUT actual borra el OUT: marca uno nuevo
  cuando quieras. Un OUT antes del IN se ignora.
- Un loop puede **apagarse conservando sus marcadores**: quedan inertes hasta que lo vuelvas a
  activar.


## Monitoreo

Usa los monitores para saber qué está ocurriendo en tiempo real:

- Monitor del motor (parámetros activos)
- Información del Audio
- Contexto del Mundo Entrelazado
- Identidad del Orbiter

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

## Controles globales vs específicos

Algunos controles son globales y se mantienen al cambiar de dimensión, como:

- Transporte
- Loop
- Volumen

La mayoría de los controles de interpretación son específicos por dimensión y cambian al cambiar de dimensión.
