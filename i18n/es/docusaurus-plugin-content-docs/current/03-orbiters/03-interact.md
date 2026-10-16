---
title: Interactuar
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

<IsoFigure name="orbiters/console" label="La consola de un Orbitador: una pantalla con el Mundo, su anillo y su Luna, tres perillas en fila para X, Y y Z con un interruptor delante de cada una, un rack con el instrumento y tres efectos, y tres teclas para las dimensiones.">
  Pasa por encima de la consola: a lo ancho gira X, arriba y abajo gira Y.
</IsoFigure>

Piensa en lo que tocas como la consola de la nave del Orbitador:

| En la consola | En un Orbitador |
|---|---|
| **La pantalla** | lo que ves mientras tocas: el Mundo gira cuando giras los ejes |
| **Las tres perillas** en fila | los ejes X, Y y Z, de izquierda a derecha. Cada una gira de −180° a 180° y descansa en 0° |
| **El hexágono** delante de cada perilla | el interruptor de ese eje |
| **La caja alta con dos carretes**, la primera del rack | el instrumento |
| **Las tres cajas que la siguen** | los efectos, en el orden en que el sonido pasa por ellos. El marcador de cada una sigue a la perilla a la que está mapeada |
| **Las tres teclas** | las dimensiones I, II y III |

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

El transporte, el loop y el volumen son comunes a las tres. Los ejes, el panel Cosmic LFO y los
sensores pertenecen a la dimensión en la que estás; el panel puede mostrar cualquier LFO de las
dimensiones del Orbitador.

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

Un Orbitador tiene **tres LFO por dimensión**, ondas lentas que mueven cosas por sí solas: **LFO 1 X,
1 Y, 1 Z** viven en la dimensión I, **2 X … 2 Z** en la II, **3 X … 3 Z** en la III. Así, un Orbitador con
una dimensión tiene LFO 1 X, 1 Y y 1 Z, uno con dos tiene seis, y uno con tres tiene los nueve: cada menú
de LFO muestra solo esos. Los ejes y todos los módulos del Orbitador los comparten: un LFO ajustado una
vez mueve, a la vez, todo lo que lo lee.

El panel Cosmic LFO muestra el LFO que lee cada eje, una columna por eje:

- **Profundidad**: cuánto oscila el LFO. Es del LFO, así que es la misma para todo lo que lo lee.
- **Desplazamiento**: el valor alrededor del cual oscila este eje. En el centro mueve el eje por igual
  arriba y abajo; bájalo para mover los valores bajos, súbelo para los altos. Los extremos del eje
  recortan la oscilación. El desplazamiento es del eje.
- **LFO**: qué LFO lee este eje. Cada eje lee el suyo al cargar (X en la dimensión II lee el LFO 2 X);
  elige otro y la columna muestra los controles de ese LFO, así que girarlos lo cambia para todo lo que
  lo lee. Un eje puesto en el LFO de una dimensión que el Orbitador ya no tiene lee el suyo hasta que esa
  dimensión vuelve, y entonces otra vez el que elegiste; la ayuda del menú lo dice.
- **Forma**: una sola perilla que va de senoidal a triangular, rampa ascendente, cuadrada, rampa
  descendente y aleatoria, fundiendo cada forma con la siguiente; su etiqueta nombra la forma cuando
  está en una. La cuadrada y las rampas tienen bordes suaves de 4 ms, así que ninguna forma produce
  clics. La pantalla de arriba dibuja la onda que estás creando.
- **Ritmo desde**: de dónde viene el ritmo: una frecuencia que eliges (**Hz**), el tempo (**Beats**: de 8
  compases a 1/32, con puntillos y tresillos) o un valor del exoplaneta del Mundo Entrelazado (Cosmic
  LFO, Luminosidad estelar, Frecuencia, Masa). Un valor del mundo solo aparece si el mundo lo tiene; con
  uno elegido, las dos flechas bajan o suben su ritmo una octava (×½, ×2). **ƒ** muestra el ritmo al
  que va.
- **El hexágono**: enciende y apaga el LFO de este eje. Dice **cX** cuando el eje lee su propio LFO, y el
  nombre del LFO (**2Y**) cuando lee otro. Un LFO solo corre mientras algo que lo lee está encendido.

Un eje mueve sus sonidos mapeados con suavidad hasta unos 2 Hz. Para una oscilación más rápida en un
sonido, elige el LFO en la entrada de LFO del propio módulo (abajo): allí corre dentro del sonido, suave
a cualquier ritmo.

### Un LFO en un módulo {#an-lfo-in-a-module}

Un módulo nunca tiene un LFO propio: la pestaña LFO de un instrumento, el movimiento de un Tremolo o de
un Chorus, **leen uno de los LFO del Orbitador**. Su pestaña muestra:

- **El menú LFO**: cuál lee, de las dimensiones del Orbitador. Un módulo lee el LFO X de su dimensión al
  cargar (el segundo LFO de un instrumento, el Y). Elige el que lee un eje y el eje y el sonido se mueven
  juntos. Un módulo puesto en el LFO de una dimensión que el Orbitador no tiene (una que quitaste, o un
  módulo de un Orbitador más grande) lee el de su propia dimensión hasta que esa dimensión esté.
- **El hexágono de la pestaña**: enciende y apaga la conexión de este módulo. El LFO sigue corriendo
  para lo demás que lo lea.
- **Ritmo desde, Ritmo, Forma y Profundidad**: los del LFO, mostrados ahí mismo. Girarlos cambia ese LFO
  en todas partes, también en el panel Cosmic LFO.
- **Cantidad** (o la Profundidad propia del módulo) y sus extras (**Spread**, **Fase**, **Spin**): del
  módulo. La Cantidad va después de la Profundidad del LFO.

Los LFO y cuál lee cada eje y cada módulo se guardan con el Orbitador. Todos en una
<Term id="room">sala</Term> ven y oyen los mismos LFO en la misma fase, y el LFO de un efecto nunca
hace saltar un sonido al dar Play o al saltar: vuelve al pulso doblándose.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/08-use-cosmic-lfo.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>
