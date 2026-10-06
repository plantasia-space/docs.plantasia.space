import React from 'react';
import styles from './SignalChain.module.css';

// Where each kind of module sits in an Orbiter. One World dimension runs
// generator → MIDI effects → instrument → audio effects into the Star's mixer;
// a Moon is a send and return off the Star. `highlight` lights the stages a
// page is about. Labels default to English; pass `labels` to translate.
const DEFAULT_LABELS = {
  world: 'World dimension (I, II or III)',
  generator: 'Generator',
  generatorHint: 'Arpeggiator, Ephemeris, Drum Sequencer',
  midi: 'MIDI effects',
  midiHint: 'Note Echo, Velocity, Scale, Pitch',
  instrument: 'Instrument',
  instrumentHint: 'Track player, Sampler, Subtractive synth',
  audio: 'Audio effects',
  audioHint: 'Reverb, Delay, Chorus, Flanger',
  notes: 'notes',
  sound: 'sound',
  star: 'Star',
  starHint: 'mixer · main effects',
  moon: 'Moon',
  moonHint: 'send & return · audio effects',
  out: 'You hear it',
};

function Stage({ id, title, hint, on }) {
  return (
    <div className={`${styles.stage} ${on ? styles.on : ''}`} data-stage={id}>
      <div className={styles.title}>{title}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

function Arrow({ label, down }) {
  return (
    <div className={`${styles.arrow} ${down ? styles.down : ''}`} aria-hidden="true">
      <span className={styles.arrowLine} />
      {label && <span className={styles.arrowLabel}>{label}</span>}
    </div>
  );
}

export default function SignalChain({ highlight = [], labels = {}, caption }) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const on = (id) => highlight.includes(id);
  return (
    <figure className={styles.figure}>
      <div className={styles.chain}>
        <div className={styles.world}>
          <div className={styles.worldLabel}>{t.world}</div>
          <div className={styles.row}>
            <Stage id="generator" title={t.generator} hint={t.generatorHint} on={on('generator')} />
            <Arrow label={t.notes} />
            <Stage id="midi" title={t.midi} hint={t.midiHint} on={on('midi')} />
            <Arrow label={t.notes} />
            <Stage id="instrument" title={t.instrument} hint={t.instrumentHint} on={on('instrument')} />
            <Arrow label={t.sound} />
            <Stage id="audio" title={t.audio} hint={t.audioHint} on={on('audio')} />
          </div>
        </div>
        <Arrow down />
        <div className={styles.bus}>
          <Stage id="star" title={t.star} hint={t.starHint} on={on('star')} />
          <div className={styles.send} aria-hidden="true">⇄</div>
          <Stage id="moon" title={t.moon} hint={t.moonHint} on={on('moon')} />
        </div>
        <Arrow down />
        <div className={styles.out}>{t.out}</div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
