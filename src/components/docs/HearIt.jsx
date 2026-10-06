import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import styles from './HearIt.module.css';

// A short before/after pair for a module page: the same phrase dry, then
// through the module. One clip plays at a time and nothing plays until asked.
// Switching Dry/Wet while playing carries on from the same moment in the other
// clip, so the ear compares like for like. Both files are loudness-matched.
export default function HearIt({ dry, wet, caption }) {
  const src = { dry: useBaseUrl(dry), wet: useBaseUrl(wet) };
  const audio = { dry: useRef(null), wet: useRef(null) };
  const [side, setSide] = useState('dry');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const t = {
    title: translate({ id: 'docs.hearIt.title', message: 'Hear it', description: 'Heading of a before/after audio example on a module page' }),
    dry: translate({ id: 'docs.hearIt.dry', message: 'Dry', description: 'Audio example: the sound without the module' }),
    wet: translate({ id: 'docs.hearIt.wet', message: 'Wet', description: 'Audio example: the sound through the module' }),
    play: translate({ id: 'docs.hearIt.play', message: 'Play', description: 'Audio example: play button label' }),
    pause: translate({ id: 'docs.hearIt.pause', message: 'Pause', description: 'Audio example: pause button label' }),
    choose: translate({ id: 'docs.hearIt.choose', message: 'Which version to hear', description: 'Audio example: label of the Dry/Wet switch' }),
  };

  const current = () => audio[side].current;

  useEffect(() => {
    const el = current();
    if (!el) return undefined;
    const tick = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const end = () => { setPlaying(false); el.currentTime = 0; setProgress(0); };
    el.addEventListener('timeupdate', tick);
    el.addEventListener('ended', end);
    return () => { el.removeEventListener('timeupdate', tick); el.removeEventListener('ended', end); };
  }, [side]);

  // Stop when the page goes away mid-clip.
  useEffect(() => () => { audio.dry.current?.pause(); audio.wet.current?.pause(); }, []);

  const toggle = () => {
    const el = current();
    if (playing) { el.pause(); setPlaying(false); return; }
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const choose = (next) => {
    if (next === side) return;
    const from = current();
    const to = audio[next].current;
    if (from && to) {
      to.currentTime = from.currentTime || 0;
      if (playing) {
        from.pause();
        to.play().catch(() => setPlaying(false));
      }
    }
    setSide(next);
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.player}>
        <span className={styles.title}>{t.title}</span>
        <button
          type="button"
          className={styles.play}
          onClick={toggle}
          aria-label={`${playing ? t.pause : t.play}: ${caption}, ${side === 'dry' ? t.dry : t.wet}`}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            {playing
              ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" />
              : <path d="M4.5 2.5v11l9-5.5z" fill="currentColor" />}
          </svg>
        </button>
        <div className={styles.switch} role="group" aria-label={t.choose}>
          {['dry', 'wet'].map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.option} ${side === s ? styles.on : ''}`}
              aria-pressed={side === s}
              onClick={() => choose(s)}
            >
              {s === 'dry' ? t.dry : t.wet}
            </button>
          ))}
        </div>
        <div className={styles.track} aria-hidden="true">
          <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      <audio ref={audio.dry} src={src.dry} preload="metadata" />
      <audio ref={audio.wet} src={src.wet} preload="metadata" />
    </figure>
  );
}
