import React from 'react';
import styles from './StepFlow.module.css';

// A walkthrough's steps as a diagram: numbered steps, grouped by where they
// happen (a menu, a Studio step), each a link to its section on the page.
// groups: [{ label, steps: [{ n, label, href }] }]
export default function StepFlow({ groups, caption }) {
  return (
    <figure className={styles.figure}>
      <ol className={styles.flow}>
        {groups.map((group) => (
          <li key={group.label} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            <ol className={styles.steps}>
              {group.steps.map((step) => (
                <li key={step.n} className={styles.step}>
                  <a href={step.href} className={styles.link}>
                    <span className={styles.number}>{step.n}</span>
                    <span className={styles.label}>{step.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
