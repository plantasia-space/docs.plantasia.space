// Mail links put together in the browser (PLA-724): the built HTML carries the address in two
// data attributes and no `mailto:`, so a scraper reading the HTML finds nothing.
function fill() {
  for (const el of document.querySelectorAll('a[data-email-user][data-email-domain]')) {
    const email = `${el.dataset.emailUser}@${el.dataset.emailDomain}`;
    el.href = `mailto:${email}`;
    el.textContent = email;
  }
}

export function onRouteDidUpdate() {
  if (typeof document !== 'undefined') fill();
}
