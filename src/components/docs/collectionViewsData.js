// Where each kind of collection opens, in each docs language. Read by the CollectionViews
// diagram and by the raw-Markdown view (src/plugins/raw-markdown), so the two never disagree.
// `id` is also the heading anchor on the Collections › Interact page (#audios, #worlds…).
// `page`: the heading of its page on Plantasia Space (null = no page). `via`: the way into the
// multi-Orbiter view (null = none). `direct`: it opens in the multi-Orbiter view straight away.
export const COLLECTION_VIEWS = {
  en: {
    labels: {
      kind: 'Collection',
      page: 'Page on Plantasia Space',
      multi: 'Multi-Orbiter view',
      direct: 'opens here directly',
      none: 'no page',
      noMulti: 'none',
    },
    rows: [
      { id: 'audios', kind: 'Audios', page: 'Tracklist', via: 'Studio button' },
      { id: 'worlds', kind: 'Worlds', page: 'Entangled Worlds', via: null },
      { id: 'orbiters', kind: 'Orbiters', page: 'Orbiters', via: null },
      { id: 'mixed', kind: 'Mixed', page: null, via: null, direct: true },
    ],
  },
  es: {
    labels: {
      kind: 'Colección',
      page: 'Página en Plantasia Space',
      multi: 'Vista multi-Orbitador',
      direct: 'se abre aquí directamente',
      none: 'sin página',
      noMulti: 'no',
    },
    rows: [
      { id: 'audios', kind: 'Audios', page: 'Lista de audios', via: 'botón Estudio' },
      { id: 'worlds', kind: 'Mundos', page: 'Mundos Entrelazados', via: null },
      { id: 'orbiters', kind: 'Orbitadores', page: 'Orbitadores', via: null },
      { id: 'mixed', kind: 'Mixta', page: null, via: null, direct: true },
    ],
  },
};

export function collectionViewsFor(locale) {
  return COLLECTION_VIEWS[locale] ?? COLLECTION_VIEWS.en;
}

// The same diagram as a Markdown table, for the raw view.
export function collectionViewsMarkdown(locale) {
  const { labels: l, rows } = collectionViewsFor(locale);
  const multi = (row) =>
    row.direct ? `${l.direct} → ${l.multi}` : row.via ? `${row.via} → ${l.multi}` : l.noMulti;
  return [
    `| ${l.kind} | ${l.page} | ${l.multi} |`,
    '|---|---|---|',
    ...rows.map((row) => `| ${row.kind} | ${row.page ?? l.none} | ${multi(row)} |`),
  ].join('\n');
}
