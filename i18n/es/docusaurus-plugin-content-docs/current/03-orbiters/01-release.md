---
title: Publicar
wrapperClassName: doc-wrapper-icon-release
sidebar_position: 2
sidebar_custom_props:
  icon: ReleaseIcon
---

## Dónde empezar

Ve a **Publicar → Nuevo Orbitador**.

![Nuevo Orbitador](/img/orbiters/release/new.es.png)

El formulario de publicación te permite definir la **identidad visual** del Orbitador, elegir un **contexto de vista previa** y configurar su **panel** y **motor** por dimensión.

## 1) Imagen del Orbitador

Sube una imagen que identificará tu Orbitador.

- Puedes subir tu propio diseño.
- Puedes generar una imagen usando el botón de regenerar y luego editarla.

Las imágenes del Orbitador se muestran en un **marco hexagonal**. Si lo necesitas, abre las guías para diseñar con esta forma.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/es/media/orbiters/01-release-orb-image.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## 2) Nombre Orbital

Define el **Nombre Orbital**: un nombre único que identifica tu Orbiter en la plataforma.

Puedes regenerar el nombre si necesitas un punto de partida.

## 3) Audio y Mundo Entrelazado de vista previa

Elige un **Audio** y un **Mundo Entrelazado** para previsualizar tu Orbitador mientras lo diseñas.

Esta elección de vista previa **no** vincula permanentemente el Orbitador a ese Audio o Mundo.

Usa el modo pantalla completa cuando necesites una vista más clara durante las pruebas.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/es/media/orbiters/02-preview-audio-world.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## 4) Panel (por dimensión)

Piensa en el panel como los **controles de la nave**.

Los Orbitadores soportan **tres dimensiones** (World 1, World 2, World 3). Cada dimensión tiene configuraciones independientes de panel.

Configuraciones habituales del panel incluyen:

- Paleta de color
- Bordes redondeados
- Ancho del marco
- Tipografía
- Anillo (activado / color)
- Reacción de amplitud (visible cuando un Audio está sonando)
- Radio interno

### Copiar / pegar ajustes del panel

El estilo del panel es **específico por dimensión**.

Si quieres un estilo consistente entre dimensiones, usa **copiar / pegar** para el panel. Esto aplica solo al panel, no al motor.

## 5) Motor (por dimensión)

El motor define **cómo el Orbitador transforma el sonido**.

Cada dimensión tiene su propia configuración del motor y puede ofrecer distintos efectos o tipos de reproducción.

### Mapeo: mínimo / equilibrio / máximo

Cada control mapeado tiene tres puntos clave:

- **Mínimo**: comportamiento del efecto en un extremo
- **Equilibrio**: punto central (generalmente un estado neutro o bypass)
- **Máximo**: comportamiento del efecto en el extremo opuesto

Una estrategia útil es mantener **el equilibrio en 0** como un punto confiable de “sin efecto”.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/es/media/orbiters/03-panel-dimension.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## 6) Colaboración y visibilidad

Define quién puede:

- **Ver** el Orbiter
- **Publicar** usando el Orbiter
- **Editar** el Orbiter

También puedes establecer reglas de acceso generales (por ejemplo: cualquiera con el enlace puede ver / publicar / editar).

Por defecto, los Orbiters son visibles y se pueden buscar.

## 7) Borrador vs publicación

- **Guardar borrador** si quieres continuar más tarde.
- **Publicar** cuando estés listo para lanzar.

Después de publicar, puedes reutilizar el Orbitador en diferentes Audios y Mundos Entrelazados.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/es/media/orbiters/04-collaborate-draft-release.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>
