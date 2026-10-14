import React, { useRef } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import { useAnatomyModule } from 'plantasia.space-design/react/anatomy';
import 'plantasia.space-design/anatomy/iso.css';
import styles from './IsoFigure.module.css';

// A live figure: one object drawn in isometric line, moved by the reader.
// `name` is a module under static/figures/ ("orbiters/lens"), built by the
// ps-docs-figures skill on the design library's anatomy kit (ps-anatomy): it
// exports the drawing (`svg`) and `mount(root, say)`.
// The drawing carries no words and no background: the page explains it, and
// what the figure says as it moves (`say`) is written under it, as page text.
// The figure brings its own accessible name; `label` describes the drawing and
// is shown in its place if the figure cannot load. Children are the caption.
export default function IsoFigure({ name, label, children }) {
  const { colorMode } = useColorMode();
  const url = useBaseUrl(`/figures/${name}.js`);
  const stageRef = useRef(null);
  // Without its figure the page still reads: the label stands in for the drawing.
  const { readout, missing } = useAnatomyModule(url, stageRef);

  return (
    <figure className={styles.figure}>
      {missing ? <p className={styles.caption}>{label}</p> : <div ref={stageRef} className={`iso ${styles.stage}`} data-theme={colorMode} />}
      {!missing && (
        <figcaption className={styles.caption}>
          <span className={styles.readout}>{readout}</span>
          {children}
        </figcaption>
      )}
    </figure>
  );
}
