---
title: Publicar
sidebar_position: 2
sidebar_custom_props:
  icon: ReleaseIcon
---

Las imágenes muestran la app en inglés; el texto nombra los botones como se ven en español.

## Dónde empezar {#start}

Ve a **Publicar → Nuevo Mundo Entrelazado**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/plantasia-space/release/release-menu.jpg"
  alt="La barra lateral con Publicar abierto: Nuevo Audio, Nuevo Mundo Entrelazado, Nuevo Orbitador, Nueva Colección y Nuevo Clip."
  width={360}
/>

El mundo nuevo se abre en **World Studio**. Lo haces en cuatro pasos, que se ven arriba en la página: **Origen**, **Historia**, **Paisaje** y **Publicar**. Puedes pasar de uno a otro en cualquier orden, y tu trabajo se guarda como borrador mientras avanzas. Los números de abajo son las partes de cada paso, en el orden en que aparecen.

<StepFlow
  stacked
  groups={[
    { label: 'Origen', steps: [
      { n: 1, label: 'Elige un exoplaneta', href: '#exoplanet' },
      { n: 2, label: 'Lee el planeta', href: '#planet' },
      { n: 3, label: 'Nombra tu mundo', href: '#name' },
    ] },
    { label: 'Historia', steps: [
      { n: 4, label: 'Da forma a los elementales', href: '#elementals' },
      { n: 5, label: 'Escribe la historia', href: '#text' },
      { n: 6, label: 'Dale una voz', href: '#voice' },
    ] },
    { label: 'Paisaje', steps: [
      { n: 7, label: 'Mira el mundo', href: '#world' },
      { n: 8, label: 'Haz la textura', href: '#texture' },
      { n: 9, label: 'Fija las imágenes', href: '#pictures' },
    ] },
    { label: 'Publicar', steps: [
      { n: 10, label: 'Portada', href: '#cover' },
      { n: 11, label: 'Colaboración', href: '#collaboration' },
      { n: 12, label: 'Preparación del mundo', href: '#readiness' },
      { n: 13, label: 'Publicar', href: '#release' },
    ] },
  ]}
/>

Para una primera vez guiada, abre **Tutoriales → Tu primer Mundo Entrelazado**: unas tarjetas te llevan por los mismos pasos dentro de World Studio.

Según tu plan, puedes tener un número limitado de mundos, publicados o en borrador. Mira [Planes y créditos](/docs/plantasia-space/plans-and-credits).

## Cómo está organizado World Studio {#layout}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-layout.jpg"
  alt="World Studio en el paso Historia de Flatfish: la historia en el escenario, la tarjeta Geografía en el cajón y los ajustes de Texto en el inspector, a la derecha."
  dots={[['A', 39, 41], ['B', 49, 69], ['C', 89.6, 27]]}
/>

- **A. El escenario** ocupa la página: el cielo, la historia o el mundo en 3D, según el paso.
- **B. El cajón**, abajo, tiene las tarjetas del paso. Deslízalo hacia los lados, o arrastra su borde superior para hacerlo más alto. Cuando las tarjetas no caben, una franja debajo muestra un bloque por tarjeta: arrástrala o haz clic en ella para moverte.
- **C. El inspector**, a la derecha, tiene los ajustes del paso. Origen no tiene.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-top-bar.jpg"
  alt="La barra de arriba de World Studio: Alternar módulos, Alternar inspector, Deshacer, Rehacer, los cuatro pasos, el punto de guardado, Pregunta a Orchidea y Salir del estudio."
  wide
/>

La barra de arriba, de izquierda a derecha:

- **Alternar módulos** y **Alternar inspector** muestran u ocultan el cajón y el inspector
- **Deshacer** y **Rehacer**
- Los cuatro pasos
- **Presets** y **Aleatorio**, solo en el paso Historia (mira [4](#elementals))
- Un punto que muestra si tu último cambio está guardado
- **Pregunta a Orchidea**, la flor, abre a [Orchidea](/docs/plantasia-space/orchidea), la asistente
- **Salir del estudio** te lleva de vuelta a Plantasia Space

### En un teléfono

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-phone.jpg"
  alt="World Studio en un teléfono, con Step 2 of 4 · Story arriba y la historia y la tarjeta Geografía debajo."
  width={360}
/>

Arriba se lee **Paso 2 de 4 · Historia**: tócalo para ver los pasos e ir a otro. El inspector se abre como una hoja desde abajo, las tarjetas del cajón se deslizan hacia los lados y Publicar es una sola columna. Orchidea se abre sobre toda la página.

## Origen

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky.jpg"
  alt="El paso Origen: el buscador de exoplanetas sobre el mapa del cielo con NGTS-9 b elegido, los tres datos a la izquierda y los botones del mapa a la derecha."
  wide
  dots={[[2, 8.2, 29.6]]}
/>

### 1. Elige un exoplaneta {#exoplanet}

Cada mundo nace de un exoplaneta real. El escenario es un mapa de todo el cielo, y cada **punto azul** es una estrella con planetas de los que puede nacer un mundo. Arrastra para moverte por él y acerca o aleja con la rueda, pellizcando o con los botones de zoom; un **anillo** sigue a tu puntero hasta el punto azul más cercano, y un clic lo elige.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky-pick.jpg"
  alt="El mapa del cielo acercado sobre Virgo y Sextans: los puntos azules son estrellas con planetas, y un anillo bajo el puntero marca la más cercana, lista para elegir."
  wide
  dots={[[1, 33.3, 41]]}
/>

También puedes buscar por nombre o número en el cuadro sobre el cielo, o elegir ahí uno de los planetas sugeridos. Los datos del planeta fijan los ritmos del LFO Cósmico de un Orbitador; más allá de eso, qué planeta eliges es una elección artística.

Los botones bajo el mapa acercan y alejan, centran en tu planeta, vuelven al **Cielo entero** y eligen qué **Capas** se ven: Exoplanetas, Cielo nocturno y Guías. Puedes cambiar el exoplaneta más adelante.

### 2. Lee el planeta {#planet}

Con un planeta elegido, el escenario muestra tres datos: la **luz solar** que recibe comparada con la Tierra, su **temperatura de equilibrio** y su **distancia** en años luz, con el año en que salió su luz y el año en que se descubrió. En un teléfono están detrás de **Datos del planeta**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-cards.jpg"
  alt="La tarjeta Cuerpo Astronómico con la órbita de NGTS-9 b a escala, y la tarjeta Nombre artístico con Flatfish."
  wide
  dots={[[2, 17.1, 8.9], [3, 84.7, 8.9]]}
/>

La tarjeta **Cuerpo Astronómico** dibuja el sistema del planeta a escala: cada planeta conocido de su estrella en su órbita, junto a la órbita de la Tierra para comparar. Las órbitas se dibujan como círculos, porque el catálogo no tiene su forma.

### 3. Nombra tu mundo {#name}

La tarjeta **Nombre artístico** fija el nombre del mundo, y te avisa si otro mundo ya lo tiene. Para empezar, elige un reino (Plantae, Fungi o Animalia) y genera uno.

## Historia

### 4. Da forma a los elementales {#elementals}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-elementals.jpg"
  alt="La tarjeta Geografía en el cajón: su figura, el tipo de planeta y los biomas y las aguas para elegir."
  wide
  dots={[[4, 59.5, 8]]}
/>

El cajón tiene los elementales del mundo como tarjetas: **Geografía**, **Flora**, **Fauna**, **Sociedad**, **Historia** y **Elementos**. Son la identidad del mundo: la historia, la textura y las imágenes se hacen a partir de ellos.

Ajusta cada tarjeta a mano, o usa **Presets** y **Aleatorio**, arriba en la página. **Restablecer**, en el menú Presets, vuelve a los valores iniciales.

### 5. Escribe la historia {#text}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-text.jpg"
  alt="La pestaña Texto del inspector: toda la historia, con tono, formato, punto de vista, idioma, el modelo de IA con su precio y Regenerar."
  width={300}
  dots={[[5, 95, 90.6]]}
/>

El escenario muestra la historia como la mostrará la página del mundo, en siete capítulos: Introducción, Geografía, Flora, Fauna, Sociedad, Historia y Coda Narrativa. Cada uno se convierte en una parte de la [página del mundo](./index.mdx#la-página-del-mundo).

En el inspector, en **Texto**, elige el tono, el formato, el punto de vista y el idioma, y el modelo de IA (su precio en créditos está en el botón). Genera toda la historia, o abre un capítulo para rehacer solo ese. También puedes escribir o cambiar cualquier capítulo por tu cuenta, hasta 2000 caracteres.

### 6. Dale una voz {#voice}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-voice-made.jpg"
  alt="La pestaña Voz del inspector con una voz ya hecha: tu propia voz, y la voz hecha con la voz July, su velocidad, el modelo de IA y el botón para crearla de nuevo."
  width={300}
  dots={[[6, 95, 89.9]]}
/>

En la pestaña **Voz**, en la voz hecha, una sola voz de IA lee toda la historia. Elige la voz, su velocidad y sus instrucciones (su carácter, su ánimo y su ritmo), y selecciona **Crear la voz**. Mientras suena, la línea que se lee se ilumina en el escenario.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-listen.jpg"
  alt="Un capítulo en el escenario cuando ya tiene voz: World Intro con Listen y su duración, 0:41."
  width={480}
/>

Con **tu propia voz**, también puedes leer un capítulo: ábrelo y sube tu grabación, de hasta 20 minutos. Suena igual que una voz generada y no cuesta créditos.

Cada capítulo guarda hasta diez versiones de su voz: escucha cualquiera y elige la que lee el capítulo. Si cambias el texto de un capítulo después de crear su voz, muestra **Más antigua que el texto** hasta que selecciones **Crear la voz de nuevo**.

## Paisaje

### 7. Mira el mundo {#world}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-world.jpg"
  alt="El paso Paisaje: Flatfish en 3D con sus lunas, los botones Mundo, Luna y Estrella a la izquierda, las Imágenes en el inspector y las tarjetas del cielo y la estrella en el cajón."
  dots={[[7, 5.5, 53.8]]}
/>

El escenario muestra el mundo en 3D. Arrastra para girarlo y haz zoom para acercarte. Los botones a la izquierda del escenario llevan la cámara al **Mundo**, su **Luna** o su **Estrella**, y muestran las tarjetas de ese cuerpo.

Las tarjetas del cajón dan forma a lo que ves: **Campo Estelar**, **Estrella**, **Luz**, **Capa**, **Superficie**, **Nubes** y **Lunas**. El campo estelar es el cielo real visto desde la estrella del mundo; su botón **Cómo se hace este cielo** lo explica.

### 8. Haz la textura {#texture}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-surface.jpg"
  alt="La tarjeta Superficie: la textura que lleva el mundo, tres texturas con una seleccionada, el estilo y Generar."
  wide
  dots={[[8, 97, 70.9]]}
/>

En la tarjeta **Superficie**, genera la textura del planeta. Elige el modelo de IA y guíalo con su estilo: medio artístico, técnica, y color y luz. Luego selecciona la textura que lleva el mundo. Un mundo necesita una textura seleccionada para publicarse.

### 9. Fija las imágenes {#pictures}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-pictures.jpg"
  alt="La Introducción abierta en Paisaje: su figura en el escenario con el alfiler debajo y, en el inspector, la figura, Hacer una imagen y Subir."
  dots={[[9, 43.5, 93.2]]}
/>

El inspector tiene las imágenes de los siete capítulos. Cada uno tiene su figura (un dibujo que World Studio hace para él) y hasta diez imágenes.

Abre un capítulo y sus imágenes ocupan el escenario, en lugar del mundo y del cajón. Desliza el escenario (o selecciona una imagen en el inspector) para verlas, y pellizca o toca dos veces para hacer zoom. Mirar no cambia nada: selecciona el **alfiler** bajo una imagen para que sea la que muestra la página del mundo. Hasta que fijes una, se muestra la figura.

En el inspector puedes hacer una imagen a partir del texto del capítulo, subir la tuya o quitar una. Un capítulo necesita su texto para que se pueda hacer una imagen a partir de él. Las imágenes pueden compartir el aspecto de la textura o tener uno propio.

Las texturas, historias, voces e imágenes hechas con IA se pagan con tus créditos. Mira [Planes y créditos](/docs/plantasia-space/plans-and-credits).

## Publicar

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/release-panel.jpg"
  alt="El inspector del paso Publicar: la Portada con Capturar el mundo y Subir imagen, la Preparación del mundo con su lista y Publicar cambios."
  width={300}
  dots={[[10, 35, 9.8], [12, 4.5, 48.5], [13, 5, 96.5]]}
/>

### 10. Portada {#cover}

Gira y acerca el mundo en el escenario, elige su Mundo, Luna o Estrella y selecciona **Capturar el mundo**. O sube una imagen. La portada se muestra en un círculo. Sin portada, la figura de ADN del mundo ocupa su lugar.

### 11. Colaboración {#collaboration}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/collaboration.jpg"
  alt="Colaboración: Agregar xPlorers con el menú de rol y el buscador."
  width={300}
  dots={[[11, 60, 12.2]]}
/>

Con **Agregar xPlorers**, suma personas y dale a cada una un rol:

- **Visualizar**: puede ver el mundo
- **Publicar**: además puede publicar Audios dentro de él, y publicar el mundo
- **Editar**: además puede editar el mundo y cambiar quién trabaja en él

En **Acceso general**, deja el mundo **Restringido** o ábrelo a **Cualquiera con el enlace**. Solo quien es titular del mundo puede cambiar el acceso general.

Debajo de Colaboración, **Publicar la historia como audio** une los capítulos con voz en un Audio. Mira [La historia como audio](./05-story-audio.md).

### 12. Preparación del mundo {#readiness}

La lista muestra lo que le falta al mundo. Un paso al que le falta algo tiene su propio botón **Ir a**.

Para publicarse, un mundo necesita:

- Un **Exoplaneta** real y un **Nombre** (Origen)
- Una **Textura seleccionada** (Paisaje)
- **Sin trabajos de IA en curso**
- **Permiso**: solo quien es titular del mundo y quienes tienen el rol Publicar pueden publicarlo

Los **Elementales**, una **Historia** y una **Portada** se recomiendan, pero no son obligatorios.

### 13. Publicar {#release}

Selecciona **Publicar Mundo Entrelazado** cuando quieras que otras personas exploren y usen el mundo. Después, el botón dice **Publicar cambios**: mira [Editar](./02-edit.md).
