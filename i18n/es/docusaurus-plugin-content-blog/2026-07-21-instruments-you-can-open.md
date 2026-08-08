---
title: Instrumentos que se pueden abrir
description: Sobre el mecanismo visible — por qué el sonido que escuchas debería mostrarte de dónde viene, y por qué Plantasia Space ahora es código abierto.
slug: instruments-you-can-open
authors: [plantasia]
tags: [updates]
image: https://dev-herbarium.plantasia.space/image-assets/plantae/common-objects-sea-shore/common-objects-sea-shore-019.png
image_credit: "Subjects(s) - Wood, J. G., & Evans, E. (1859). The common objects of the sea shore : including hints for an aquarium. Routledge, Warnes & Routledge. https://www.biodiversitylibrary.org/item/138181"
---

Un instrumento acústico no te esconde nada.

<!-- truncate -->

Abre un piano y el mecanismo está ahí — el macillo, la cuerda, el apagador, el fieltro. Presiona una tecla lo bastante despacio y puedes observar el evento exacto que produce el sonido. Aprender a tocar y aprender cómo funciona resultan ser actividades emparentadas. El instrumento te enseña sobre sí mismo mientras lo usas.

El sonido electroacústico rompió esa relación, y R. Murray Schafer le puso nombre a una parte de la ruptura: esquizofonía, la separación entre un sonido original y su reproducción [1]. Él escribía sobre la grabación. La separación siguió creciendo después de él. Buena parte del software musical llega hoy como una caja con un resultado del otro lado, y las herramientas generativas más nuevas llevan ese arreglo hasta su conclusión — entra un prompt, sale música terminada, y el mecanismo entre ambos está oculto y además es de alguien más.

Mi problema con esto no es que sea demasiado fácil. Lo fácil está bien. El piso bajo es justamente el punto.

Mi problema es que el mecanismo oculto vuelve imposible cierto tipo de aprendizaje. **No puedes construir intuición sobre un proceso que nunca te dejan mirar.** Puedes desarrollar gusto por los resultados y preferencias entre las salidas, pero la relación queda con forma de consumo.

Casi todo lo que construimos este último mes es, mirado desde cierto ángulo, una larga discusión con ese arreglo. Y llega por grados.

El grado más superficial es poder *verlo*. Los Orbitadores corren sobre un nuevo motor de sonido — puedes estirar un audio sin arrastrar su pitch, tocarlo en reversa, romperlo en granos con síntesis granular. Lo que me importa más que la lista es que cada efecto ahora tiene su propio comportamiento visual en la escena. Los granos que escuchas tienen algo que mirar. Puedes ver lo que estás escuchando, y al rato empiezas a anticiparlo.

Un grado más allá es poder *configurarlo*. El feed de inicio pasó a ser algo que eliges en vez de algo que se elige por ti: cuatro modos detrás de un selector en la esquina — una mezcla, orden cronológico estricto, lo que la gente está tocando, y trabajos anteriores que quizás te perdiste. Funciona con los conteos que ya teníamos. No hay rastreo nuevo, ni un perfil tuyo armándose por detrás para adivinar qué te gustaría. El orden es una decisión tuya, y puedes cambiarla en un segundo.

El último grado nos tomó años, y llegamos este mes. **Plantasia Space es código abierto.**

Los Orbitadores y los Mundos Entrelazados — las aplicaciones mismas, no una demostración de ellas — están públicos en GitHub. También el runtime que comparten: el renderizado en Three.js, y el reloj que sostiene todo a tiempo. También el sistema de diseño. Todo en [github.com/plantasia-space](https://github.com/plantasia-space).

Las licencias son el lugar donde vive la intención, y no son las mismas a propósito. Las librerías compartidas son MIT — tómalas, construye otra cosa, no nos debes nada. Los instrumentos son AGPL — construye sobre ellos, y tu versión también queda abierta. Una es un regalo. La otra es una condición. **Un instrumento que se puede abrir debería seguir siendo abrible.**

Quiero ser precisa sobre qué es esto, porque "código abierto" se anuncia más seguido de lo que se practica. Los repositorios están públicos y licenciados. La documentación para quien quiera contribuir todavía no está escrita. Nadie hizo un fork, y nadie mandó un parche. Lo que existe hoy es permiso — el resto es una práctica, y las prácticas tardan más que los lanzamientos.

Hay algo más chico a lo que le tengo el mismo cariño. Cada orbitador que alguien ya había hecho suena exactamente como antes. Motor nuevo abajo, ningún instrumento roto arriba. Lo que la gente construyó sigue siendo suyo, y sigue funcionando.

Nada de esto convierte a nadie en mejor músicx por sí solo. El mecanismo visible es una condición previa, no un método.

Pero un instrumento que se puede abrir sobrevive a quienes lo hicieron. Un piano sigue funcionando esté o no en pie la fábrica que lo construyó, porque cualquiera puede levantarle la tapa y entender lo que hay adentro. Esa es la propiedad que quiero que esto tenga — un mecanismo que puedes inspeccionar, en vez de una empresa en la que tienes que confiar.

La tapa está levantada. ¿Qué harías con eso?

---

### Referencias

[1] R. Murray Schafer, *The Tuning of the World* (1977)
