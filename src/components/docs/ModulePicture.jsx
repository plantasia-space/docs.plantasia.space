import React, { useCallback, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ModulePicture.module.css';

// A module's picture with numbered dots over its controls (the Ableton manual's
// device pictures). Each dot is [number, x, y] in % of the picture, so it stays
// on its control whatever size the picture is drawn at. The same number appears
// next to the control's name in the text, through <Dot>.
export default function ModulePicture({ src, alt, dots = [] }) {
  // A wide panel keeps a readable size on a phone and scrolls sideways in its
  // own frame instead of shrinking under its dots.
  const [wide, setWide] = useState(false);
  const measure = useCallback((img) => {
    if (img && img.naturalWidth) setWide(img.naturalWidth > img.naturalHeight * 1.6);
  }, []);
  return (
    <figure className={`${styles.figure} ${wide ? styles.wide : ''}`}>
      <div className={styles.frame}>
        <img
          ref={measure}
          className={styles.image}
          src={useBaseUrl(src)}
          alt={alt}
          loading="lazy"
          onLoad={(e) => measure(e.currentTarget)}
        />
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
