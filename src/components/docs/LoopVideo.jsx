import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import styles from './LoopVideo.module.css';

// A short silent loop of one gesture in the Studio (Attio's help pages). It
// plays muted while it is on screen and stops when it scrolls away. With
// "reduce motion" on it waits on its poster behind a play button. A small
// button pauses it at any time. `src` is the path without its extension:
// `<src>.webm`, `<src>.mp4` and the poster `<src>.jpg` sit side by side.
export default function LoopVideo({ src, caption, label, width = 1280, height = 800 }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const pausedByViewer = useRef(false);
  const visible = useRef(false);
  const base = useBaseUrl(src);

  const playLabel = translate({ id: 'docs.loopVideo.play', message: 'Play video', description: 'Button on a short looping docs video that starts it' });
  const pauseLabel = translate({ id: 'docs.loopVideo.pause', message: 'Pause video', description: 'Button on a short looping docs video that pauses it' });

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    const promise = video.play();
    if (promise) promise.catch(() => setPlaying(false));
  };

  useEffect(() => {
    const video = videoRef.current;
    // React does not write `muted` into the markup: set it before any play().
    video.muted = true;
    video.defaultMuted = true;
    setReady(true);

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = motion.matches;
    setReduced(reduce);
    const onMotion = (e) => {
      reduce = e.matches;
      setReduced(reduce);
      if (reduce) video.pause();
    };
    motion.addEventListener('change', onMotion);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (!entry.isIntersecting) video.pause();
        else if (!reduce && !pausedByViewer.current) play();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  const toggle = () => {
    if (playing) {
      pausedByViewer.current = true;
      videoRef.current.pause();
    } else {
      pausedByViewer.current = false;
      play();
    }
  };

  const big = ready && reduced && !started && !playing;

  return (
    <figure className={styles.figure}>
      <div className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
        <video
          ref={videoRef}
          className={styles.video}
          poster={`${base}.jpg`}
          width={width}
          height={height}
          loop
          playsInline
          preload="none"
          aria-label={label || caption}
          onPlay={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
        {ready && (
          <button
            type="button"
            className={big ? styles.big : styles.corner}
            onClick={toggle}
            aria-label={playing ? pauseLabel : playLabel}
            title={playing ? pauseLabel : playLabel}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
