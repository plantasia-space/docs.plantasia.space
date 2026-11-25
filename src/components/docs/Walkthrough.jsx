import React, { useEffect, useRef, useState } from 'react';
import { translate } from '@docusaurus/Translate';
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
  const zoomLabel = translate({ id: 'docs.walkthrough.zoom', message: 'Zoom', description: 'Button on a walkthrough preview picture that opens it full size' });

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
      const title = h.textContent.replace(/[\u200B#]+$/, '').trim();
      const pictures = [];
      for (let n = h.nextElementSibling; n && n.tagName !== 'H2'; n = n.nextElementSibling) {
        const imgs = n.tagName === 'IMG' ? [n] : [...n.querySelectorAll('img')];
        imgs.forEach((img) => pictures.push({ src: img.getAttribute('src'), alt: decode(img.alt) }));
      }
      return { title, pictures };
    });
    // A step without a picture keeps its own title and borrows the pictures before it.
    let last = [];
    setShots(found.map((s) => ({ ...s, pictures: (last = s.pictures.length ? s.pictures : last) })));

    // The current step is the last heading above a line 35 % down the window.
    // The observer wakes when a heading enters or leaves the window's top 35 %;
    // scrollend catches a jump that lands with no heading there.
    const pick = () => {
      const line = window.innerHeight * 0.35;
      let i = 0;
      headings.forEach((h, k) => {
        if (h.getBoundingClientRect().top < line) i = k;
      });
      setActive(i);
    };
    pick();
    const observer = new IntersectionObserver(pick, { rootMargin: '0px 0px -65% 0px' });
    headings.forEach((h) => observer.observe(h));
    window.addEventListener('scrollend', pick);
    return () => {
      observer.disconnect();
      window.removeEventListener('scrollend', pick);
    };
  }, []);

  return (
    <div className={`${styles.walkthrough} ${shots.some((s) => s.pictures.length) ? styles.ready : ''}`}>
      <div ref={textRef} className={styles.text}>
        {children}
      </div>
      <aside className={styles.preview}>
        <div className={styles.sticky}>
          {shots.map(
            (s, i) =>
              s.pictures.length > 0 && (
                <figure key={i} className={`${styles.shot} ${i === active ? styles.on : ''}`}>
                  <strong className={styles.title}>{s.title}</strong>
                  {s.pictures.map((pic) => (
                    <React.Fragment key={pic.src}>
                      <button
                        type="button"
                        className={styles.zoom}
                        onClick={() => setZoomed(pic)}
                        aria-label={`${zoomLabel}: ${pic.alt}`}
                        title={zoomLabel}
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
