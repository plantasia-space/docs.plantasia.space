import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ModulePicture.module.css';

// A module's picture with numbered dots over its controls (the Ableton manual's
// device pictures). Each dot is [number, x, y] in % of the picture, so it stays
// on its control whatever size the picture is drawn at. The same number appears
// next to the control's name in the text, through <Dot>. `wide` (a panel more
// than 1.6× as wide as tall) keeps a readable size on a phone and scrolls
// sideways in its own frame instead of shrinking under its dots. `width` caps
// the drawn width in px, for a tall picture such as a phone screen, and outlines
// it so a black screen keeps its edge on a dark page. Ignored with `wide`, which
// has its own phone width.
export default function ModulePicture({ src, alt, dots = [], wide = false, width }) {
  return (
    <figure className={`${styles.figure} ${wide ? styles.wide : ''}`}>
      <div className={styles.frame} style={width && !wide ? { width: `min(100%, ${width}px)` } : undefined}>
        <img className={`${styles.image} ${width && !wide ? styles.outlined : ''}`} src={useBaseUrl(src)} alt={alt} loading="lazy" />
        {dots.map(([n, x, y]) => (
          <span key={n} className={styles.dot} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
            {n}
          </span>
        ))}
      </div>
    </figure>
  );
}

// The number of a control, inline in a table or a sentence, matching its dot.
export function Dot({ children }) {
  return <span className={styles.inline}>{children}</span>;
}
