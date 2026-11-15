---
title: Tu primer Mundo Entrelazado en 10 minutos
sidebar_label: Primeros pasos
description: Haz un Mundo Entrelazado a partir de un exoplaneta real (un nombre, una historia y una textura) y publícalo.
sidebar_position: 1.5
sidebar_custom_props:
  icon: Rocket
---

En diez minutos haces un Mundo Entrelazado pequeño: un exoplaneta real, un nombre, una historia escrita con IA y una textura para el planeta. Después lo publicas. Necesitas haber iniciado sesión en Plantasia Space, y la historia y la textura usan algunos créditos (el precio está en cada botón).

Las imágenes muestran la app en inglés; el texto nombra los botones como se ven en español.

<StepFlow
  stacked
  groups={[
    { label: 'Menú Publicar', steps: [{ n: 1, label: 'Nuevo Mundo Entrelazado', href: '#start' }] },
    { label: 'Origen', steps: [
      { n: 2, label: 'Elige un planeta', href: '#exoplanet' },
      { n: 3, label: 'Ponle nombre', href: '#name' },
    ] },
    { label: 'Historia', steps: [
      { n: 4, label: 'Dale forma', href: '#elementals' },
      { n: 5, label: 'Escribe la historia', href: '#text' },
    ] },
    { label: 'Paisaje', steps: [{ n: 6, label: 'Haz su textura', href: '#texture' }] },
    { label: 'Publicar', steps: [{ n: 7, label: 'Publícalo', href: '#release' }] },
  ]}
/>

## 1. Empieza un mundo nuevo {#start}

Abre **Publicar → Nuevo Mundo Entrelazado**. El mundo se abre en **World Studio**, en su primer paso, **Origen**. Los cuatro pasos están arriba en la página; tu trabajo se guarda como borrador mientras avanzas.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/plantasia-space/release/release-menu.jpg"
  alt="La barra lateral con Publicar abierto: Nuevo Audio, Nuevo Mundo Entrelazado, Nuevo Orbitador, Nueva Colección y Nuevo Clip."
  width={360}
/>

## 2. Elige un planeta {#exoplanet}

El escenario es un mapa de todo el cielo. Cada **punto azul** es una estrella con planetas de los que puede nacer un mundo. Elige uno en el mapa:

- **Arrastra** para moverte por el cielo, y acerca o aleja con la rueda del ratón, pellizcando o con los botones de zoom bajo el mapa.
- Un **anillo** sigue a tu puntero hasta el punto azul más cercano. **Haz clic** para elegirlo.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky-pick.jpg"
  alt="El mapa del cielo acercado sobre Virgo y Sextans: los puntos azules son estrellas con planetas, y un anillo bajo el puntero marca la más cercana, lista para elegir."
  wide
  dots={[[2, 33.3, 41]]}
/>

O escribe un nombre o un número en el buscador sobre el cielo, o elige ahí uno de los planetas sugeridos. Con un planeta elegido, su mira aparece en el mapa y el escenario muestra cuánta luz solar recibe, qué temperatura tiene y a qué distancia está.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky.jpg"
  alt="El paso Origen: el buscador de exoplanetas sobre el mapa del cielo con NGTS-9 b elegido, y los tres datos a la izquierda."
  wide
/>

## 3. Ponle nombre {#name}

En la tarjeta **Nombre artístico**, escribe un nombre, o elige un reino (Plantae, Fungi o Animalia) y genera uno. La tarjeta te dice si el nombre está libre.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-cards.jpg"
  alt="La tarjeta Cuerpo Astronómico, y la tarjeta Nombre artístico con Flatfish."
  wide
  dots={[[3, 84.7, 8.9]]}
/>

## 4. Dale forma {#elementals}

Abre el paso **Historia**. El cajón tiene los elementales del mundo: su geografía, flora, fauna, sociedad, historia y elementos. Para empezar rápido, pulsa **Aleatorio** arriba en la página; puedes cambiar cualquier tarjeta después.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-top-bar.jpg"
  alt="La barra de arriba de World Studio, con Presets y Aleatorio a la derecha en el paso Historia."
  wide
  dots={[[4, 84.3, 50]]}
/>

## 5. Escribe la historia {#text}

En el inspector, en la pestaña **Texto**, deja el tono, el formato y el idioma o cámbialos, y selecciona el botón blanco bajo el modelo de IA, con el precio de la historia. Los siete capítulos aparecen en el escenario. Puedes reescribir cualquiera por tu cuenta.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-text.jpg"
  alt="La pestaña Texto del inspector: toda la historia, con tono, formato, punto de vista, idioma, el modelo de IA con su precio y el botón para escribirla."
  width={300}
  dots={[[5, 95, 90.6]]}
/>

## 6. Haz su textura {#texture}

Abre el paso **Paisaje** y desliza el cajón hasta la tarjeta **Superficie**. Pulsa **Generar** y selecciona la textura que te guste: el planeta la lleva puesta. Un mundo necesita una textura seleccionada para publicarse.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-surface.jpg"
  alt="La tarjeta Superficie: la textura que lleva el mundo, tres texturas con una seleccionada, el estilo y Generar."
  wide
  dots={[[6, 97, 70.9]]}
/>

## 7. Publícalo {#release}

Abre el paso **Publicar**. La **Preparación del mundo** muestra lo que está listo; cuando esté completa, selecciona **Publicar Mundo Entrelazado**. Tu mundo ya tiene su propia página en Plantasia Space. (En un mundo ya publicado, el botón dice **Publicar cambios**, como en la imagen.)

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/release-panel.jpg"
  alt="El inspector del paso Publicar: la Portada, la Preparación del mundo con su lista y el botón para publicar."
  width={300}
  dots={[[7, 5, 96.5]]}
/>

Para hacer los mismos pasos con tarjetas dentro de World Studio, abre **Tutoriales → Tu primer Mundo Entrelazado**.

## Siguiente

- **Dale una voz**: una voz lee toda la historia, y cada capítulo puede mostrar su propia imagen. Mira [Publicar](./01-release.md#voice).
- **Una portada y personas**: captura el mundo como portada e invita a xPlorers a trabajar en él, en [Publicar](./01-release.md#cover).
- **Publica la historia como un Audio**, en [La historia como audio](./05-story-audio.md).
- **Haz un Clip**: un video corto de tu mundo con música, en [Studio y Clips](./04-studio.md).
