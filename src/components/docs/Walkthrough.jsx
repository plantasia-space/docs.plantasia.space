import React, { useEffect, useRef, useState } from 'react';
import styles from './Walkthrough.module.css';

// Steps on the left, the current step's picture pinned on the right (Stripe's
// quickstarts, with the Studio in place of code). The pictures stay in the
// text, so on a phone or without JavaScript each step simply shows its own.
// Each `##` step's first picture is its preview; a step without one keeps the
// picture before it.
export default function Walkthrough({ children }) {
  const textRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const text = textRef.current;
    const headings = [...text.querySelectorAll('h2')];
    // Alt text can arrive entity-encoded ("Panel&#39;s"): decode it once.
    const decode = (encoded) => {
      const el = document.createElement('textarea');
      el.innerHTML = encoded;
      return el.value;
    };
    const found = headings.map((h) => {
      const pictures = [];
      for (let n = h.nextElementSibling; n && n.tagName !== 'H2'; n = n.nextElementSibling) {
        const imgs = n.tagName === 'IMG' ? [n] : [...n.querySelectorAll('img')];
        imgs.forEach((img) => pictures.push({ src: img.getAttribute('src'), alt: decode(img.alt) }));
      }
      return pictures.length ? { title: h.textContent.replace(/[\u200B#]+$/, '').trim(), pictures } : null;
    });
    // A step without a picture keeps the one before it.
    let last = null;
    setShots(found.map((s) => (last = s ?? last)));

    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let i = 0;
      headings.forEach((h, k) => {
        if (h.getBoundingClientRect().top < line) i = k;
      });
      setActive(i);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={`${styles.walkthrough} ${shots.some(Boolean) ? styles.ready : ''}`}>
      <div ref={textRef} className={styles.text}>
        {children}
      </div>
      <aside className={styles.preview} aria-hidden="true">
        <div className={styles.sticky}>
          {shots.map(
            (s, i) =>
              s && (
                <figure key={i} className={`${styles.shot} ${i === active ? styles.on : ''}`}>
                  <strong className={styles.title}>{s.title}</strong>
                  {s.pictures.map((pic) => (
                    <React.Fragment key={pic.src}>
                      <img src={pic.src} alt="" loading="lazy" />
                      <p className={styles.caption}>{pic.alt}</p>
                    </React.Fragment>
                  ))}
                </figure>
              ),
          )}
        </div>
      </aside>
    </div>
  );
}
