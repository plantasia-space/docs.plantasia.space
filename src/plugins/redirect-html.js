// A static page that sends the browser on to `target`: GitHub Pages has no
// server-side redirects, so a moved page leaves one of these at its old address.
const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export function redirectHtml({ target, canonical, htmlLang }) {
  const attr = escapeHtml(target);
  // `<` escaped so a route can never close the inline script early.
  const js = JSON.stringify(target).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="${escapeHtml(htmlLang)}">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta http-equiv="refresh" content="0; url=${attr}">
<script>location.replace(${js} + location.search + location.hash);</script>
</head>
<body><a href="${attr}">${attr}</a></body>
</html>
`;
}
