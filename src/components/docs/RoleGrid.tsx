import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Check } from 'lucide-react';
import { roleGridFor } from './roleGridData';
import styles from './RoleGrid.module.css';

type Cell = boolean | string;

// Who can do what, drawn in the same family as StepFlow and CollectionViews: one row per role, one
// column per thing they may do, a check where they can. `id` picks the grid in roleGridData.js, in
// the page's language. On a phone every role becomes a small card whose cells name their column.
export default function RoleGrid({ id, caption }: { id: string; caption?: React.ReactNode }) {
  const { i18n } = useDocusaurusContext();
  const { label, role, yes, no, columns, rows } = roleGridFor(id, i18n.currentLocale) as {
    label: string;
    role: string;
    yes: string;
    no: string;
    columns: string[];
    rows: { role: string; cells: Cell[] }[];
  };
  const template = { '--role-grid-columns': columns.length } as React.CSSProperties;

  const mark = (value: Cell) => {
    if (value === true) {
      return (
        <span className={styles.yes}>
          <Check size={14} strokeWidth={3} aria-hidden="true" />
          <span className={styles.srOnly}>{yes}</span>
        </span>
      );
    }
    if (value === false) {
      return (
        <span className={styles.no}>
          <span aria-hidden="true">—</span>
          <span className={styles.srOnly}>{no}</span>
        </span>
      );
    }
    return <span className={styles.note}>{value}</span>;
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.grid} role="table" aria-label={label} style={template}>
        <div className={styles.head} role="row">
          <span role="columnheader">{role}</span>
          {columns.map((column) => (
            <span key={column} role="columnheader" className={styles.headCell}>
              {column}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.role} className={styles.row} role="row">
            <div role="rowheader" className={styles.role}>
              {row.role}
            </div>
            {row.cells.map((value, index) => (
              <div key={columns[index]} role="cell" className={styles.cell}>
                <span className={styles.cellLabel}>{columns[index]}</span>
                {mark(value)}
              </div>
            ))}
          </div>
        ))}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
