---
title: Orbitadores para quien usa un DAW
sidebar_label: Para usuarios de DAW
description: "Si conoces un DAW: el Mundo, la Luna, la Estrella y sus dimensiones como pistas, pistas de retorno y el bus principal."
sidebar_position: 1.7
sidebar_custom_props:
  icon: SlidersVertical
---

Si has hecho música en un DAW, las partes de un Orbitador corresponden a cosas que ya conoces. Los nombres son los del Orbitador; esta página es la traducción.

## Los cuerpos son grupos de pistas

Un Orbitador tiene tres cuerpos, cada uno un grupo de hasta tres pistas: sus dimensiones **I**, **II** y **III**.

| En un Orbitador | En un DAW |
|---|---|
| **<Term id="world-dimension">Mundo</Term>** | tus pistas: donde se hace el sonido |
| una **dimensión del Mundo** | una de esas pistas |
| **<Term id="moon">Luna</Term>** | pistas de retorno: los efectos a los que envía el Mundo |
| una **dimensión de la Luna** | una pista de retorno, alimentada por un envío desde cada dimensión del Mundo |
| **<Term id="star">Estrella</Term>** | el bus principal: donde todo se junta antes de que lo oigas |
| una **dimensión de la Estrella** | procesamiento en el bus principal, después de su mezclador |
| la **Mezcla principal**, en Estrella I | el mezclador del bus principal: un nivel, un Mute y un Solo para el Mundo y para la Luna |
| un **[Canal](/docs/orbiters/audio-effects/channel)** | el fader de una pista, su Solo, su Mute y sus envíos |

## El Mundo: una pista de audio, o pistas MIDI

Lo que toca el Mundo I decide qué tipo de Orbitador es.

- **Orbitador de audio**: el Mundo I es la pista de audio; toca el audio que eliges. II y III toman lo que toca I y lo procesan, uno tras otro o en paralelo, como buses detrás de él.
- **Orbitador de notas**: cada dimensión del Mundo es como una pista MIDI. Puede tocar un instrumento con sus propias notas, o procesar la dimensión anterior.

## La Luna: envíos y retornos

El Canal de cada dimensión del Mundo tiene un envío a cada dimensión de la Luna, tomado **Pre** o **Post** su Nivel, como un envío de un DAW. La Luna aplica sus efectos y devuelve solo el efecto, así que un efecto en una Luna empieza en **Dry/wet 100 %**. Ahí vive una reverb o un delay que comparte todo el Orbitador. Mira [Efectos de audio](/docs/orbiters/audio-effects) para saber dónde va cada efecto.

## La Estrella: el bus principal

El Mundo y el retorno de la Luna se juntan en la **Mezcla principal** de la Estrella. Los efectos propios de la Estrella suenan sobre todo lo que viene después, como inserciones en el bus principal.

## Cada dimensión es un rack con tres macros

Piensa en cada dimensión como un rack cuyas tres macros siempre están ahí: sus <Term id="axis">ejes</Term>, **X**, **Y** y **Z**. Cada uno gira a la vez todos los controles asignados a él, y los tocas moviéndote: en la pantalla, con las teclas o inclinando un teléfono. Cada dimensión asigna sus tres a su manera, así que pasar a otra dimensión cambia lo que mueven X, Y y Z.

## El Cosmic LFO: tres por dimensión

Las ondas lentas del Cosmic LFO vienen de tres en tres, un juego por dimensión: **1cX**, **1cY** y **1cZ** para la dimensión I, hasta **3cX**, **3cY** y **3cZ** para la III. Por ahora pertenecen al Mundo, y los ejes y los módulos de todo el Orbitador las comparten, así que una onda puede mover cosas en todas las pistas.

[Interactuar](/docs/orbiters/interact) muestra cómo tocar todo esto.
