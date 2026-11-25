import React, { useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import styles from './TryModule.module.css';

// The frame's border (1px each side) comes out of its height (border-box), plus
// a little room so a rounding never shows a scrollbar.
const FRAME_ALLOWANCE = 6;

// The Orbiters app's own messages (src/embed/module/frameBridge.ts there).
const HEIGHT_MESSAGE = 'ps-module-embed:height';
const STOP_MESSAGE = 'ps-module-embed:stop';

// "Try it": the real module, played in the page. Closed, it is its children
// (the module's picture, dots and all) and a button; nothing of the app loads.
// Open, the picture gives way to the Orbiters app's module embed in a frame:
// the module's own panel and its own sound, on a sound the reader picks or
// their own file (decoded in the frame, never uploaded). The frame is sized
// to what it reports, and told to stop once it scrolls out of view. Without
// an embed URL for this build (siteConfig.customFields.orbitersEmbedUrl) it
// is the picture alone.
//
// module: one id or a signal-order list ("delay,reverb"); set: opening values,
// prefixed with the 1-based position ("1.mix:50,2.mix:40"). An unprefixed key
// still addresses the first module. Root hosts the shared Orbiters module frame.
export default function TryModule({ module, set, source, children }) {
  const { siteConfig, i18n } = useDocusaurusContext();
  const base = siteConfig.customFields?.orbitersEmbedUrl;
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(440);
  const frameRef = useRef(null);

  // Only this frame's messages size it.
  useEffect(() => {
    if (!open) return undefined;
    const onMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.origin !== new URL(base, window.location.href).origin) return;
      const { type, height: next } = event.data ?? {};
      if (type === HEIGHT_MESSAGE && Number.isFinite(next) && next > 0) setHeight(Math.min(Math.ceil(next) + FRAME_ALLOWANCE, 1600));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [open, base]);

  // Out of sight, it stops playing.
  useEffect(() => {
    const frame = frameRef.current;
    if (!open || !frame || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) frame.contentWindow?.postMessage({ type: STOP_MESSAGE }, new URL(base, window.location.href).origin);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [open, base]);

  if (!base) return <>{children}</>;

  const params = new URLSearchParams({ embed: 'module', module, lang: i18n.currentLocale });
  if (set) params.set('set', set);
  if (source) params.set('source', source);
  const src = `${base}?${params}`;

  const tryLabel = translate({ id: 'docs.tryModule.try', message: 'Try it', description: 'Button that loads a playable module in the page' });
  const closeLabel = translate({ id: 'docs.tryModule.close', message: 'Close', description: 'Button that closes the playable module and shows its picture again' });
  const frameTitle = translate({ id: 'docs.tryModule.frameTitle', message: 'Playable module', description: 'Accessible title of the frame holding a playable module' });
  const caption = translate({ id: 'docs.tryModule.plays', message: 'Plays the real module in your browser.', description: 'Caption under a playable module' });

  return (
    <figure className={styles.figure}>
      {open ? (
        <iframe
          ref={frameRef}
          className={styles.frame}
          src={src}
          title={frameTitle}
          style={{ height }}
          allow="autoplay"
          loading="lazy"
        />
      ) : children}
      <figcaption className={styles.bar}>
        <button type="button" className={styles.button} onClick={() => setOpen(!open)} aria-expanded={open}>
          {!open && (
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
          )}
          {open ? closeLabel : tryLabel}
        </button>
        <span className={styles.caption}>{caption}</span>
      </figcaption>
    </figure>
  );
}
