// Short definitions shown when you hover a <Term>. Each id is a heading id on the
// glossary page (docs/00-plantasia-space/30-glossary.md and its es mirror), where
// the full entry lives. Keep each definition to the glossary entry's first sentence.
const glossaryTerms = {
  axis: {
    en: 'One of an Orbiter’s three performance controls, X, Y and Z. Moving an axis moves every control mapped to it.',
    es: 'Uno de los tres controles de interpretación de un Orbiter, X, Y y Z. Al mover un eje se mueven todos los controles mapeados a él.',
  },
  equilibrium: {
    en: 'The value a mapped control takes while its axis rests in the middle, between its minimum and its maximum.',
    es: 'El valor que toma un control mapeado mientras su eje descansa en el centro, entre su mínimo y su máximo.',
  },
  moon: {
    en: 'An Orbiter body that works as a send and return: the World is sent to it, and it returns only its effect, added to the dry sound.',
    es: 'Un cuerpo del Orbiter que funciona como envío y retorno: el Mundo se envía a ella y solo devuelve su efecto, sumado al sonido seco.',
  },
  star: {
    en: 'The Orbiter body where the sound comes together: its mixer blends the World and the Moon, and its effects play over everything.',
    es: 'El cuerpo del Orbiter donde se junta el sonido: su mezclador combina el Mundo y la Luna, y sus efectos suenan sobre todo.',
  },
  'world-dimension': {
    en: 'One of an Orbiter’s three World chains, I, II and III, each with its own modules and its own X, Y and Z mappings.',
    es: 'Una de las tres cadenas de Mundo de un Orbiter, I, II y III, cada una con sus módulos y sus propios mapeos de X, Y y Z.',
  },
};

export default glossaryTerms;
