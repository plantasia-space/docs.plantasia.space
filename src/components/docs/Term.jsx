import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import styles from './Term.module.css';

const TIP_WIDTH = 288; // matches .tip max-width (18rem)
const GAP = 6;

// A glossary word: hover (or focus) shows its short definition, a click opens
// its full entry on the glossary page. `id` is the glossary heading id; the
// definition is that entry's first sentence (src/plugins/glossary-terms).
// The box is placed in window coordinates, so a table's scroll box can't clip it.
export default function Term({ id, children }) {
  const definition = usePluginData('glossary-terms')[id];
  const tipId = useId();
  const linkRef = useRef(null);
  const [place, setPlace] = useState(null);

  const open = useCallback(() => {
    const r = linkRef.current.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.left, window.innerWidth - TIP_WIDTH - 8));
    // Above the word, or below it when the word is near the top of the window.
    setPlace(r.top > 140 ? { left, top: r.top - GAP, above: true } : { left, top: r.bottom + GAP, above: false });
  }, []);
  const close = useCallback(() => setPlace(null), []);

  useEffect(() => {
    if (!place) return undefined;
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [place, close]);

  if (!definition) {
    throw new Error(`<Term id="${id}">: no glossary entry with {#${id}}`);
  }
  // Mouse handlers sit on a wrapper: Link keeps onMouseEnter for prefetching.
  return (
    <>
      <span onMouseEnter={() => window.matchMedia('(hover: hover)').matches && open()} onMouseLeave={close}>
        <Link
          ref={linkRef}
          to={`/docs/plantasia-space/glossary#${id}`}
          className={styles.link}
          aria-describedby={tipId}
          onFocus={open}
          onBlur={close}
        >
          {children}
        </Link>
      </span>
      <span
        role="tooltip"
        id={tipId}
        className={`${styles.tip} ${place ? styles.open : ''} ${place?.above ? styles.above : ''}`}
        style={place ? { left: place.left, top: place.top } : undefined}
      >
        {definition}
      </span>
    </>
  );
}
