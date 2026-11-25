import React from 'react';

// A product chip for What's new lists (Orbiters, Audios, Entangled Worlds, Collections, Platform).
// Plain class names, not a CSS module: the root app's What's new pop-up renders the same HTML from
// the JSON feed and styles these classes itself (PLA-514). The colour comes from `product` when a
// label is not the product's English name (or not plain text).
export default function Product({ product, children }) {
  const name = product ?? (typeof children === 'string' ? children : '');
  const key = name.toLowerCase().replace(/\s+/g, '-');
  return <span className={key ? `wn-chip wn-chip--${key}` : 'wn-chip'}>{children}</span>;
}
