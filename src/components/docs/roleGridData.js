// Who can do what, as a grid: one row per role, one column per thing they may do, in each docs
// language. Read by the RoleGrid diagram and by the raw-Markdown view (src/plugins/raw-markdown),
// so the two never disagree. A cell is `true` (yes), `false` (no) or a short note ("own Clips only").
// The rules are the platform's: an entity's roles, and Clips following their world's roles.
export const ROLE_GRIDS = {
  // Sharing › Worlds, Orbiters and Collections: the roles you give people.
  'entity-roles': {
    en: {
      label: 'Roles in a World, Orbiter or Collection',
      role: 'Role',
      yes: 'yes',
      no: 'no',
      columns: ['View', 'Publish inside', 'Edit', 'Invite people', 'General Access', 'Archive / delete'],
      rows: [
        { role: 'Owner', cells: [true, true, true, true, true, true] },
        { role: 'Editor', cells: [true, true, true, true, false, false] },
        { role: 'Publisher', cells: [true, true, false, false, false, false] },
        { role: 'Viewer', cells: [true, false, false, false, false, false] },
      ],
    },
    es: {
      label: 'Roles en un Mundo, Orbitador o Colección',
      role: 'Rol',
      yes: 'sí',
      no: 'no',
      columns: ['Ver', 'Publicar dentro', 'Editar', 'Invitar personas', 'Acceso general', 'Archivar / eliminar'],
      rows: [
        { role: 'Owner', cells: [true, true, true, true, true, true] },
        { role: 'Editor', cells: [true, true, true, true, false, false] },
        { role: 'Publisher', cells: [true, true, false, false, false, false] },
        { role: 'Viewer', cells: [true, false, false, false, false, false] },
      ],
    },
  },
  // Studio & Clips › Who can work on a Clip: a Clip follows its world's roles, and its maker
  // always keeps full control of it.
  'clip-roles': {
    en: {
      label: 'Who can work on a Clip',
      role: 'In the Clip’s world',
      yes: 'yes',
      no: 'no',
      columns: ['Watch released', 'Open in the Studio, edit, release', 'See drafts', 'Archive / delete'],
      rows: [
        { role: 'Owner', cells: [true, true, true, true] },
        { role: 'Editor', cells: [true, true, true, false] },
        { role: 'Publisher', cells: [true, 'Own Clips', 'Own Clips', 'Own Clips'] },
        { role: 'Viewer and everyone', cells: [true, false, false, false] },
        { role: 'The Clip’s maker', cells: [true, true, true, true] },
      ],
    },
    es: {
      label: 'Quién puede trabajar en un Clip',
      role: 'En el mundo del Clip',
      yes: 'sí',
      no: 'no',
      columns: ['Ver publicados', 'Abrir en el Studio, editar, publicar', 'Ver borradores', 'Archivar / eliminar'],
      rows: [
        { role: 'Owner', cells: [true, true, true, true] },
        { role: 'Editor', cells: [true, true, true, false] },
        { role: 'Publisher', cells: [true, 'Sus Clips', 'Sus Clips', 'Sus Clips'] },
        { role: 'Viewer y el resto', cells: [true, false, false, false] },
        { role: 'Quien hizo el Clip', cells: [true, true, true, true] },
      ],
    },
  },
};

export function roleGridFor(id, locale) {
  const grid = ROLE_GRIDS[id];
  if (!grid) throw new Error(`[RoleGrid] unknown grid: ${id}`);
  return grid[locale] ?? grid.en;
}

// The same diagram as a Markdown table, for the raw view.
export function roleGridMarkdown(id, locale) {
  const { role, yes, no, columns, rows } = roleGridFor(id, locale);
  const cell = (value) => (value === true ? yes : value === false ? no : value);
  return [
    `| ${role} | ${columns.join(' | ')} |`,
    `|---|${columns.map(() => '---').join('|')}|`,
    ...rows.map((row) => `| ${row.role} | ${row.cells.map(cell).join(' | ')} |`),
  ].join('\n');
}
