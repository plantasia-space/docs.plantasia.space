import React, { useId } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import glossaryTerms from './glossaryTerms';
import styles from './Term.module.css';

// A glossary word: hover (or focus) shows its short definition, a click opens
// its full entry on the glossary page. `id` is the glossary heading id.
export default function Term({ id, children }) {
  const { i18n } = useDocusaurusContext();
  const tipId = useId();
  const entry = glossaryTerms[id];
  if (!entry) {
    throw new Error(`<Term id="${id}">: no such glossary term`);
  }
  const definition = entry[i18n.currentLocale] ?? entry.en;
  return (
    <span className={styles.term}>
      <Link to={`/docs/plantasia-space/glossary#${id}`} className={styles.link} aria-describedby={tipId}>
        {children}
      </Link>
      <span role="tooltip" id={tipId} className={styles.tip}>
        {definition}
      </span>
    </span>
  );
}
