import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { worldPartsFor } from './worldPartsData';
import styles from './WorldParts.module.css';

// Each story chapter you write in World Studio becomes one part of the world page, in the
// page's language (worldPartsData.js). Same frame as StepFlow and CollectionViews. On a phone
// the two columns stay side by side, with the header naming them.
export default function WorldParts({ caption }) {
  const { i18n } = useDocusaurusContext();
  const { labels: l, rows } = worldPartsFor(i18n.currentLocale);
  return (
    <figure className={styles.figure}>
      <div className={styles.grid} role="table" aria-label={`${l.chapter} → ${l.part}`}>
        <div className={styles.head} role="row">
          <span role="columnheader">{l.chapter}</span>
          <span aria-hidden="true" />
          <span role="columnheader">{l.part}</span>
        </div>
        {rows.map(([chapter, part], i) => (
          <div key={chapter} className={styles.row} role="row">
            <div role="rowheader" className={styles.chapter}>
              <span className={styles.number}>{i + 1}</span>
              {chapter}
            </div>
            <span className={styles.arrow} aria-hidden="true">→</span>
            <div role="cell" className={styles.part}>{part}</div>
          </div>
        ))}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
