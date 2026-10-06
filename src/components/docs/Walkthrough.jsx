import React, { useEffect, useRef, useState } from 'react';
import styles from './Walkthrough.module.css';

// Steps on the left, the current step's picture pinned on the right (Stripe's
// quickstarts, with the Studio in place of code). The pictures stay in the
// text, so on a phone or without JavaScript each step simply shows its own.
// Each `##` step's pictures are its preview; a step without any keeps the
// pictures before it. A preview picture opens full size on click.
export default function Walkthrough({ children }) {
  const textRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(null);
  const dialogRef = useRef(null);

  // The native dialog brings focus, Esc to close and the backdrop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (zoomed && !dialog.open) dialog.showModal();
    if (!zoomed && dialog.open) dialog.close();
  }, [zoomed]);

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
      <aside className={styles.preview}>
        <div className={styles.sticky}>
          {shots.map(
            (s, i) =>
              s && (
                <figure key={i} className={`${styles.shot} ${i === active ? styles.on : ''}`}>
                  <strong className={styles.title}>{s.title}</strong>
                  {s.pictures.map((pic) => (
                    <React.Fragment key={pic.src}>
                      <button
                        type="button"
                        className={styles.zoom}
                        onClick={() => setZoomed(pic)}
                        aria-label={`Zoom: ${pic.alt}`}
                        title="Zoom"
                      >
                        <img src={pic.src} alt="" loading="lazy" />
                      </button>
                      <p className={styles.caption}>{pic.alt}</p>
                    </React.Fragment>
                  ))}
                </figure>
              ),
          )}
        </div>
      </aside>
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setZoomed(null)}
        onClick={() => setZoomed(null)}
        aria-label={zoomed?.alt}
      >
        {zoomed && <img src={zoomed.src} alt={zoomed.alt} />}
      </dialog>
    </div>
  );
}
