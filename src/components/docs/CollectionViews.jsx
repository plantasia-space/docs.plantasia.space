import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { collectionViewsFor } from './collectionViewsData';
import styles from './CollectionViews.module.css';

// Where each kind of collection opens: its page on Plantasia Space, the multi-Orbiter view, or
// both. One row per kind, in the page's language (collectionViewsData.js); each kind links to its
// section. On a phone every row becomes a small card whose cells carry their column names.
export default function CollectionViews({ caption }) {
  const { i18n } = useDocusaurusContext();
  const { labels: l, rows } = collectionViewsFor(i18n.currentLocale);
  return (
    <figure className={styles.figure}>
      <div className={styles.grid} role="table" aria-label={`${l.kind}: ${l.page} / ${l.multi}`}>
        <div className={styles.head} role="row">
          <span role="columnheader">{l.kind}</span>
          <span role="columnheader">{l.page}</span>
          <span role="columnheader">{l.multi}</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className={styles.row} role="row">
            <div role="rowheader" className={styles.kindCell}>
              <a href={`#${row.id}`} className={styles.kind}>
                {row.kind}
              </a>
            </div>
            <div role="cell" className={styles.cell}>
              <span className={styles.cellLabel}>{l.page}</span>
              {row.page ? (
                <span className={styles.view}>{row.page}</span>
              ) : (
                <span className={styles.empty}>{l.none}</span>
              )}
            </div>
            <div role="cell" className={styles.cell}>
              <span className={styles.cellLabel}>{l.multi}</span>
              {row.direct || row.via ? (
                <>
                  <span className={styles.arrow}>
                    {row.direct ? l.direct : row.via}
                    <span aria-hidden="true"> →</span>
                  </span>
                  <span className={`${styles.view} ${styles.multi}`}>{l.multi}</span>
                </>
              ) : (
                <span className={styles.empty}>
                  <span aria-hidden="true">—</span>
                  <span className={styles.srOnly}>{l.noMulti}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
