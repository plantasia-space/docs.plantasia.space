import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import './IsoFigure.kit.css';
import styles from './IsoFigure.module.css';

// The figure is a static file, not part of the bundle: the browser imports it
// by URL, out of the bundler's sight.
const loadFigure = new Function('url', 'return import(url)');

// A live figure: one object drawn in isometric line, moved by the reader.
// `name` is a module under static/figures/ ("orbiters/lens"), built by the
// ps-docs-figures skill: it exports the drawing (`svg`) and `mount(root, say)`.
// The drawing carries no words and no background: the page explains it, and
// what the figure says as it moves (`say`) is written under it, as page text.
// `label` is read out in place of the drawing; children are the caption.
export default function IsoFigure({ name, label, children }) {
  const { colorMode } = useColorMode();
  const url = useBaseUrl(`/figures/${name}.js`);
  const stageRef = useRef(null);
  const [readout, setReadout] = useState('');

  useEffect(() => {
    let unmount = null;
    let gone = false;
    loadFigure(url).then((figure) => {
      if (gone || !stageRef.current) return;
      stageRef.current.innerHTML = figure.svg;
      unmount = figure.mount(stageRef.current, setReadout);
    });
    return () => {
      gone = true;
      unmount?.();
    };
  }, [url]);

  return (
    <figure className={styles.figure}>
      <div ref={stageRef} className={`iso ${styles.stage}`} data-theme={colorMode} role="img" aria-label={label} />
      <figcaption className={styles.caption}>
        <span className={styles.readout}>{readout}</span>
        {children}
      </figcaption>
    </figure>
  );
}
