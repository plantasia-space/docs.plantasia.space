---
title: Editar
wrapperClassName: doc-wrapper-icon-edit
sidebar_position: 3
sidebar_custom_props:
  icon: Pencil
---

Editar un Orbitador te permite perfeccionar un instrumento existente sin crear uno nuevo.

### Video: Editar un Orbitador

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/es/media/orbiters/05-edit-orbiter.mp4" type="video/mp4" />
  Tu navegador no soporta la etiqueta de video.
</video>

## Qué se puede editar

Puedes actualizar un Orbitador incluso después de haberlo publicado. Es posible modificar:

- Imagen del Orbitador
- Nombre orbital (cuando las reglas lo permiten)
- Audio y Mundo Entrelazado usados para la vista previa
- Diseño del panel en cada dimensión
- Mapeos del motor por dimensión
- Configuración de colaboración y visibilidad

## Tener en cuenta las dimensiones

La mayoría de los parámetros del Orbitador son **específicos por dimensión**.

Al editar, revisa siempre cada dimensión (1, 2 y 3) y asegúrate de que:

- El estilo del panel sea correcto
- Los mapeos del motor respondan como esperas

Puedes usar copiar / pegar para replicar el estilo del panel, pero los ajustes del motor deben refinarse manualmente en cada dimensión.

## Mapear un control a un eje

Pulsa **Map** en la columna **Mappings** (o **Shift+M**): el eje **X** del escenario se pone rojo y cada control muestra una etiqueta **map**. Toca un control y su mapeo aparece en la columna con su **min**, **<Term id="equilibrium">equil</Term>** y **max**. Pulsa **Mapping…** para salir del modo Map y mueve el eje: el control lo sigue. La guía [Primeros pasos](./00-quickstart.md#map) lo recorre paso a paso.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/map-a-knob"
  caption="Map y después el Amount de la One Reverb: X · Amount aparece en la columna Mappings. Al mover X, Amount va hacia la sala por un lado y hacia la placa por el otro."
  label="Modo Map activado, se toca el Amount de la One Reverb y luego se mueve el eje X arriba y abajo mientras el knob de Amount lo sigue."
/>

Arrastra **min**, **equil** y **max** en el mapeo para fijar hasta dónde lleva el eje al control y dónde reposa:

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/min-equil-max"
  caption="Max y min hacia el centro, y después equil a 20 %: con X en reposo, Amount queda ahora en 20 %, y X lo mueve dentro del nuevo rango."
  label="En la columna Mappings se arrastran hacia el centro los extremos max y min de X · Amount, y después equil hasta 20 %; luego se mueve el eje X arriba y abajo y el knob de Amount lo sigue dentro del rango más estrecho."
/>

Los botones de curva bajo cada lado dan forma al camino entre medias: **Linear**, **Exponential** o **Logarithmic**, de min a equil y de equil a max.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/curve"
  caption="X a media altura: la curva equil → max lleva Amount de 20 % (Linear) a 6 % (Exponential) y 37 % (Logarithmic). Después lo mismo por debajo del reposo, con min → equil."
  label="Se sube el eje X a media altura y se pulsan los botones de curva de equil a max: el knob de Amount salta a un valor nuevo con cada uno; luego X baja por debajo del reposo y se pulsan los de min a equil."
/>

## Flujo de iteración

Los Orbitadores están diseñados para iterarse.

Puedes:

- Probar cambios con diferentes Audios
- Previsualizar el comportamiento en varios Mundos Entrelazados
- Ajustar los mapeos de manera gradual

## Guardar y publicar cambios

Guarda borradores mientras experimentas.

Publica los cambios cuando estés listo para que se apliquen al Orbitador público.
