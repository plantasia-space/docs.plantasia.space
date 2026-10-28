import React, { useState } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Copy, Check, AlertCircle } from 'lucide-react';

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).trimStart();
}

function cleanMdx(text) {
  return text
    // Remove import statements
    .replace(/^import\s[^\n]*\n?/gm, '')
    // Remove React component blocks: <Component ...>...</Component>
    .replace(/<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g, '')
    // Remove self-closing React components: <Component ... />
    .replace(/<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\/>/g, '')
    // Remove video and iframe blocks (may have multi-line attributes)
    .replace(/<video[\s\S]*?<\/video>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    // Collapse excess blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function CopyMarkdownButton() {
  const [status, setStatus] = useState('idle');
  const { metadata } = useDoc();
  // The page's raw Markdown, in this build's language: "@site/docs/a/b.md" or its translation
  // "@site/i18n/es/docusaurus-plugin-content-docs/current/a/b.md" → "<base>_raw/docs/a/b.md".
  const relative = metadata?.source?.replace(/^@site\/(?:docs|i18n\/[^/]+\/docusaurus-plugin-content-docs\/current)\//, '');
  const rawUrl = useBaseUrl(`/_raw/docs/${relative ?? ''}`);

  async function handleCopy() {
    if (status === 'copying') return;

    if (!relative) return;
    const url = rawUrl;

    setStatus('copying');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      await navigator.clipboard.writeText(cleanMdx(stripFrontmatter(raw)));
      setStatus('copied');
    } catch {
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const label =
    status === 'copied' ? 'Copied!' :
    status === 'error'  ? 'Failed'  :
    'Copy as Markdown';

  const Icon =
    status === 'copied' ? Check :
    status === 'error'  ? AlertCircle :
    Copy;

  return (
    <button
      className={`copy-markdown-btn copy-markdown-btn--${status}`}
      onClick={handleCopy}
      aria-label={label}
      title={label}
      disabled={status === 'copying'}
    >
      <Icon size={13} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
