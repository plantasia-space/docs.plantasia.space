import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';
import { loadFigure } from '@site/src/components/docs/IsoFigure';
import styles from './styles.module.css';

// Below this width the page is a narrow column and the tower replaces the orrery.
// The same number is in styles.module.css.
const NARROW = '(max-width: 640px)';
const THEMES = ['dark', 'light'];

// The Plantasia Space machine: every entity as a working part of one contraption,
// built by figures/src/home-machine. Two arrangements of the same parts: the
// orrery on wide screens, the tower in a narrow column. It runs by itself and
// carries no words. The page first shows the drawing as a picture; once its
// small script has loaded, the same drawing goes on the stage and starts to
// move. If that fails, the picture stays. Two small buttons: pause, and sound
// (off until asked for: each part that answers a ball then also plays).
export default function HomeFigure() {
  const { colorMode } = useColorMode();
  const base = useBaseUrl('/figures/home/');
  const stageRef = useRef(null);
  const figureRef = useRef(null);
  const themeRef = useRef(colorMode);
  themeRef.current = colorMode;
  // What the reader chose stays when the arrangement changes (a phone turned on its side).
  const chosen = useRef({ paused: false, sound: false });
  const [narrow, setNarrow] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(null);

  const labels = {
    orrery: translate({
      id: 'homepage.figure.orrery',
      message:
        'A machine that stands for Plantasia Space. A planet with a ring, an Entangled World, turns at the centre, and a small craft, an Orbiter, circles it and sends it a beam. Round them, green balls, the Audios, run on a ring track. As each ball passes, it sets off the parts round the edge in turn: a cabinet of drawers, the Collection; a console with headphones, the xPlorer; a row of tuned bars, an instrument; a sprout, a Release; and an orchid, Plantasia Space itself.',
      description: 'What the home page figure shows, wide arrangement (read by screen readers)',
    }),
    tower: translate({
      id: 'homepage.figure.tower',
      message:
        'A machine that stands for Plantasia Space, built as a tower. At the top, a cabinet of drawers, the Collection, lets go of a green ball, an Audio. It runs down a chute, hops along a row of tuned bars, an instrument, and rolls past a console with headphones, the xPlorer. At the foot, a small craft, an Orbiter, circles a planet with a ring, an Entangled World, and sends it a beam. The ball lands in a pot where a sprout, a Release, grows. An orchid, Plantasia Space itself, stands beside them.',
      description: 'What the home page figure shows, narrow arrangement (read by screen readers)',
    }),
  };
  const pauseLabel = translate({ id: 'homepage.figure.pause', message: 'Pause the machine', description: 'Button on the home page figure that stops its motion' });
  const soundOnLabel = translate({ id: 'homepage.figure.soundOn', message: 'Turn the sound on', description: 'Button on the home page figure that lets the machine make sound' });
  const soundOffLabel = translate({ id: 'homepage.figure.soundOff', message: 'Turn the sound off', description: 'Button on the home page figure that silences the machine' });
  const playLabel = translate({ id: 'homepage.figure.play', message: 'Start the machine', description: 'Button on the home page figure that starts its motion again' });

  useEffect(() => {
    const width = window.matchMedia(NARROW);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setNarrow(width.matches);
      setReduced(motion.matches);
    };
    update();
    width.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      width.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  const name = narrow ? 'tower' : 'orrery';
  const label = labels[name];

  useEffect(() => {
    // With reduced motion nothing would move: the picture is the figure.
    if (narrow === null || reduced !== false) return undefined;
    const stage = stageRef.current;
    let gone = false;
    // The picture is the one already on the page, so it comes from the cache.
    Promise.all([fetch(`${base}${name}-${themeRef.current}.svg`).then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status} ${r.url}`)))), loadFigure(`${base}${name}.js`)])
      .then(([picture, figure]) => {
        if (gone) return;
        stage.innerHTML = picture;
        const svg = stage.querySelector('svg');
        svg.setAttribute('data-theme', themeRef.current);
        // The drawing's own name is short and English: the page's words replace it.
        svg.setAttribute('aria-label', label);
        figureRef.current = figure.mount(stage);
        if (chosen.current.paused) figureRef.current.pause(true);
        if (chosen.current.sound) figureRef.current.sound(true);
        setLive(true);
      })
      .catch((error) => {
        if (gone) return;
        // The picture stays in place of the moving figure.
        console.error('Home figure:', error);
        stage.innerHTML = '';
      });
    return () => {
      gone = true;
      figureRef.current?.();
      figureRef.current = null;
      stage.innerHTML = '';
      setLive(false);
    };
  }, [base, name, narrow, reduced, label]);

  // The drawing carries both themes: it follows the site's.
  useEffect(() => {
    stageRef.current?.querySelector('svg')?.setAttribute('data-theme', colorMode);
  }, [colorMode, live]);

  const toggle = () => {
    chosen.current.paused = !paused;
    figureRef.current?.pause(!paused);
    setPaused(!paused);
  };
  const toggleSound = () => {
    chosen.current.sound = !sound;
    figureRef.current?.sound(!sound);
    setSound(!sound);
  };

  return (
    <div className={styles.figure}>
      <div className={styles.frame}>
        {!live &&
          THEMES.map((theme) => (
            <picture key={theme} className={`${styles.still} ${styles[theme]}`}>
              <source media={NARROW} srcSet={`${base}tower-${theme}.svg`} />
              {/* Dark is the site's default: it loads at once. The other waits until it is shown. */}
              <img src={`${base}orrery-${theme}.svg`} alt={label} loading={theme === 'dark' ? 'eager' : 'lazy'} decoding="async" />
            </picture>
          ))}
        <div ref={stageRef} className={styles.stage} hidden={!live} />
        {live && (
          <div className={styles.buttons}>
            <button type="button" className={styles.button} onClick={toggleSound} aria-label={sound ? soundOffLabel : soundOnLabel} title={sound ? soundOffLabel : soundOnLabel}>
              {sound ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5v5a1 1 0 0 0 1 1h3l4.3 3.6a1 1 0 0 0 1.7-.8V5.7a1 1 0 0 0-1.7-.8L8 8.5H5a1 1 0 0 0-1 1z" />
                  <path className={styles.stroke} d="M16.5 9a4.2 4.2 0 0 1 0 6M18.8 6.5a7.6 7.6 0 0 1 0 11" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5v5a1 1 0 0 0 1 1h3l4.3 3.6a1 1 0 0 0 1.7-.8V5.7a1 1 0 0 0-1.7-.8L8 8.5H5a1 1 0 0 0-1 1z" />
                  <path className={styles.stroke} d="M17 9.5l4.5 5M21.5 9.5l-4.5 5" />
                </svg>
              )}
            </button>
            <button type="button" className={styles.button} onClick={toggle} aria-label={paused ? playLabel : pauseLabel} title={paused ? playLabel : pauseLabel}>
              {paused ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
