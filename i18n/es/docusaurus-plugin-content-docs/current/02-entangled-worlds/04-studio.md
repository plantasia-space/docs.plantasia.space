---
title: Studio y Clips
sidebar_position: 6
sidebar_custom_props:
  icon: Clapperboard
---

Un **Clip** es un video corto hecho a partir de un Mundo Entrelazado: el mundo en pantalla, con música, con la voz del mundo leyendo un capítulo, o con las dos, y textos, imágenes y movimientos de cámara en una línea de tiempo. Lo haces en **Clip Studio**.

Los Clips publicados aparecen en la página del mundo, en la pestaña **Clips** del feed de inicio y en la búsqueda, con el filtro **Clips**. Los tuyos están en **Mis Clips**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/clips-feed.jpg"
  alt="El feed de inicio en la pestaña Clips, con un Clip del mundo Flatfish."
  width={600}
/>

Las imágenes muestran la app en inglés; el texto nombra los botones como se ven en español.

<StepFlow
  groups={[
    { label: 'Crear clip', steps: [{ n: 1, label: 'Elige el mundo', href: '#start' }] },
    { label: 'Clip Studio', steps: [
      { n: 2, label: 'Seleccionar audio', href: '#audio' },
      { n: 3, label: 'Configurar animaciones', href: '#animations' },
      { n: 4, label: 'Exportar', href: '#export' },
      { n: 5, label: 'Publicar Clip', href: '#release' },
    ] },
  ]}
/>

## 1. Elige el mundo {#start}

Ve a **Publicar → Nuevo Clip**, o abre el menú **Publicar** en la página de un mundo. En **Create clip** (el diálogo todavía está en inglés), elige el Mundo Entrelazado y su **Section** (el capítulo del que trata el Clip), y selecciona **Open clip studio**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/create-clip.jpg"
  alt="El diálogo Create clip con Flatfish seleccionado entre los mundos disponibles, y Open clip studio."
  width={480}
  dots={[[1, 76.9, 96.3]]}
/>

Según tu plan, puedes hacer un número limitado de Clips por mundo. Mira [Planes y créditos](/docs/plantasia-space/plans-and-credits).

## 2. Seleccionar audio {#audio}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/select-audio.jpg"
  alt="Seleccionar audio: el buscador con Exraña Señal Luminosa elegido."
  width={480}
  dots={[[2, 49.6, 25.6]]}
/>

Busca el Audio que suena de fondo en el Clip, o elige uno sugerido. Cuando la sección del Clip tiene voz, la tarjeta **Voz en off** deja que la voz lo lea en el Clip: actívala o desactívala. Un Clip puede tener música, la voz o las dos. Un Clip solo con voz empieza con la duración de la voz.

Al elegir un Audio pasas al siguiente paso. Qué parte del Audio suena se elige en la línea de tiempo.

## 3. Configurar animaciones {#animations}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/set-animations.jpg"
  alt="Configurar animaciones: el mundo en el lienzo, la barra de elementos y la línea de tiempo con la pista de música, y los ajustes de la escena en el inspector."
  dots={[['A', 43.9, 58], ['B', 39.8, 28.5], ['C', 44.2, 80], ['D', 84.5, 27.2]]}
/>

Aquí se hace el Clip: un lienzo en vivo de tu mundo, con una línea de tiempo debajo.

- **A. Elementos**: la barra sobre la línea de tiempo añade un **Texto**, una **Imagen**, un **Video**, un movimiento de cámara del **Mundo** o una **Forma**
- **B. El lienzo** muestra el Clip mientras suena
- **C. La línea de tiempo** coloca cada elemento en el tiempo
- **D. El inspector** ajusta el elemento seleccionado (**Elemento**) o todo el Clip (**Escena**)

### La línea de tiempo

Las pistas **Música** y **Voz** tienen cada una su **Volumen** y su silencio. Arrastra la música para elegir qué parte del Audio suena; su fundido de entrada y de salida se ajustan en la pista de música.

Los **Subtítulos** de la voz tienen su propia pista. Con **Vincular a la voz** activado, la voz y sus subtítulos se mueven como un solo bloque.

### Escena y elementos

En **Escena**, la pestaña **Clip** tiene el nombre del Clip, su formato y el **Preset** de tema (o tus propios colores). La pestaña **Texto** ajusta el estilo del texto: tamaño, fuente, alineación y fondo. La pestaña **Mundo** ajusta los movimientos de cámara: un preset como **Órbita calmada**, **Deriva** o **Llegada**, o **Personalizado**, y cuántos movimientos tiene el Clip (**Escaso**, **Equilibrado** o **Denso**). El texto se anima por frases, por palabras o mezclando las dos.

Selecciona cualquier elemento para cambiarlo en el inspector. Los ajustes de la escena son los valores por defecto, y cada elemento puede tener los suyos.

### Pregunta a Orchidea

Con un plan Bloom o superior, la flor de la cabecera de Clip Studio abre a [Orchidea](/docs/plantasia-space/orchidea), la asistente, junto al lienzo. Pídele algo con tus palabras y hace el cambio en tu Clip:

- El aspecto: tema, fuente, tamaño y alineación del texto, y cada cuánto se mueve la cámara
- Los elementos y la línea de tiempo: añadir o quitar textos, imágenes y movimientos de cámara, cambiar su tiempo y su animación
- El sonido: activar o desactivar la voz en off y sus subtítulos, ajustar el volumen de cada pista, silenciar una pista
- Imágenes: coloca imágenes que subiste a este mundo, de la biblioteca compartida o de las láminas de la biblioteca antigua, o crea una imagen cuadrada nueva con IA a partir de una indicación
- Edición de imágenes: cambia una de esas imágenes con IA a partir de una indicación ("hazla de noche", "quita el fondo y deja solo la flor"). La edición es una imagen nueva y la original se queda. También puede recortar el motivo sobre un fondo transparente
- Textos escritos con IA a partir de una indicación

Los textos, las imágenes y las ediciones de imágenes hechos con IA cuestan créditos, según el modelo, y Orchidea pregunta antes de cada uno. Cada imagen se revisa, tanto lo que pides como lo que se crea: una que no está permitida en Plantasia Space no se crea ni se guarda, y sus créditos vuelven.

Cada petición es un paso en el deshacer de Clip Studio. Para que Orchidea escriba textos y cree imágenes sin preguntar, desactiva **Preguntar antes de usar créditos** en su menú **⋯**; vuelve a preguntar en cada conversación nueva. Orchidea siempre pregunta antes de algo que afecta a otras personas.

## 4. Exportar {#export}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/export.jpg"
  alt="Opciones de exportación: Landscape, Square, Vertical y Portrait, la resolución del elegido, Capture video, Release Clip without video y Back to editor."
  width={520}
  dots={[[4, 95, 69.4]]}
/>

Elige la forma del video:

- **Landscape** (horizontal): YouTube / web
- **Square** (cuadrado): Social feed
- **Vertical**: Reels / Shorts
- **Portrait** (retrato): Feed post

Selecciona **Capturar video** para grabarlo. Se abre una ventana de captura: acepta allí el aviso para compartir, y deja las dos ventanas abiertas y sin cambios hasta que termine la grabación. O elige **Publicar Clip sin video** para publicar la animación sin grabarla.

La captura funciona en Chrome, Edge y Firefox de escritorio. En Safari y en un teléfono no hay paso Exportar: el Clip se publica sin video.

## 5. Publicar Clip {#release}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/release-bar.jpg"
  alt="La barra de abajo del paso Publicar Clip: Back, Thumbnail y Release Clip."
  wide
  dots={[[5, 81.9, 58]]}
/>

Revisa tu Clip antes de publicarlo. La barra de abajo tiene:

- **Miniatura**: captura un fotograma o sube una imagen. Un Clip la necesita para publicarse
- **Publicar Clip**, para publicarlo

Un Clip que todavía no se publicó tiene también **Borrador**, para guardarlo y volver más tarde. Con una grabación, la barra tiene además **Descargar** y un cambio entre la **Animación** y la **Grabación**.

Un Clip nunca es más visible que su mundo: si el mundo es privado, el Clip también lo es.

## ¿Quién puede trabajar en un Clip? {#quien-puede-trabajar-en-un-clip}

Un Clip sigue los roles de su Mundo Entrelazado (mira [Compartir](/docs/plantasia-space/sharing#permisos-individuales-de-xplorer)), y siempre conservas el control total de los Clips que haces:

<RoleGrid id="clip-roles" />

El enlace del Studio de un Clip te pide iniciar sesión si no la has iniciado, y muestra una página que lo indica si no tienes permiso para editarlo.

Trabaje quien trabaje en un Clip, sigue siendo de quien lo hizo: se publica a su nombre, y su Audio tiene que ser uno que esa persona pueda usar. Los créditos de imágenes y textos hechos con IA salen de quien los pide.

## Gestiona tus Clips

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/clip-menu.jpg"
  alt="Un Clip en el feed con su menú Más opciones abierto: Share, Edit, Archive y Delete, y el botón de descarga a la izquierda."
  wide
/>

Desde **Mis Clips** o la página del Clip, puedes:

- **Descargar** el video como **Original** o **Comprimido (MP4)**. Solo para Clips con grabación, y durante dos semanas después de la captura. Pasado ese plazo la animación se queda, y puedes volver a capturarla cuando quieras.
- **Archivar** un Clip: se oculta de los feeds y perfiles y queda privado para ti. Los Clips archivados no se pueden editar y no cuentan para los límites de tu plan. Puedes restaurarlos en cualquier momento.
- **Eliminar** un Clip de forma permanente: sus archivos se borran y los enlaces directos dejan de funcionar. Esto no se puede deshacer.

Cada Clip da crédito al Mundo Entrelazado del que se hizo y al Audio que usa, con la licencia del Audio.
