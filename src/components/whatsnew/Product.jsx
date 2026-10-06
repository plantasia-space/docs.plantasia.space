import React from 'react';

// A product chip for What's new lists (Orbiters, Audios, Entangled Worlds, Collections, Platform).
// Plain class names, not a CSS module: the root app's What's new pop-up renders the same HTML from
// the JSON feed and styles these classes itself (PLA-514).
export default function Product({children}) {
  const key = String(children).toLowerCase().replace(/\s+/g, '-');
  return <span className={`wn-chip wn-chip--${key}`}>{children}</span>;
}
