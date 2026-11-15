// The seven story chapters of an Entangled World (World Studio › Story) and the part of the
// world page each one becomes, in each docs language. Read by the WorldParts diagram and by
// the raw-Markdown view (src/plugins/raw-markdown), so the two never disagree.
// Labels are the apps' own: entangled-worlds world.json (chapters) and
// plantasia.space-root entangledWorldRelease.json (part headings).
export const WORLD_PARTS = {
  en: {
    labels: { chapter: 'Story chapter in World Studio', part: 'Part of the world page' },
    rows: [
      ['World Intro', 'World Introduction'],
      ['Geography', 'Geography DNA'],
      ['Flora', 'Flora DNA'],
      ['Fauna', 'Fauna DNA'],
      ['Society', 'Society DNA'],
      ['History', 'History DNA'],
      ['Narrative Coda', 'Narrative Coda'],
    ],
  },
  es: {
    labels: { chapter: 'Capítulo de la historia en World Studio', part: 'Parte de la página del mundo' },
    rows: [
      ['Introducción', 'Introducción al mundo'],
      ['Geografía', 'ADN de geografía'],
      ['Flora', 'ADN de flora'],
      ['Fauna', 'ADN de fauna'],
      ['Sociedad', 'ADN de sociedad'],
      ['Historia', 'ADN de historia'],
      ['Coda Narrativa', 'Coda narrativa'],
    ],
  },
};

export function worldPartsFor(locale) {
  return WORLD_PARTS[locale] ?? WORLD_PARTS.en;
}

// The same diagram as a Markdown table, for the raw view.
export function worldPartsMarkdown(locale) {
  const { labels: l, rows } = worldPartsFor(locale);
  return [
    `| | ${l.chapter} | ${l.part} |`,
    '|---|---|---|',
    ...rows.map(([chapter, part], i) => `| ${i + 1} | ${chapter} | ${part} |`),
  ].join('\n');
}
