import fs from 'fs';
import path from 'path';

// The glossary page is the only source of the short definitions <Term> shows on
// hover: every `### Title {#id}` entry gives its first sentence, per locale.
const GLOSSARY = '00-plantasia-space/30-glossary.md';

function firstSentences(file) {
  const terms = {};
  const text = fs.readFileSync(file, 'utf8');
  for (const [, id, body] of text.matchAll(/^### .*?\{#([\w-]+)\}\s*\n([\s\S]*?)(?=^###|(?![\s\S]))/gm)) {
    const paragraph = body.trim().split('\n')[0];
    const sentence = paragraph.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? paragraph;
    terms[id] = sentence.replace(/\*\*|__|\*/g, '').trim();
  }
  return terms;
}

export default function glossaryTermsPlugin(context) {
  const { siteDir, i18n } = context;
  const file = (locale) =>
    locale === i18n.defaultLocale
      ? path.join(siteDir, 'docs', GLOSSARY)
      : path.join(siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs/current', GLOSSARY);

  return {
    name: 'glossary-terms',
    getPathsToWatch() {
      return [file(i18n.defaultLocale), file(i18n.currentLocale)];
    },
    async contentLoaded({ actions }) {
      const terms = firstSentences(file(i18n.defaultLocale));
      const local = fs.existsSync(file(i18n.currentLocale)) ? firstSentences(file(i18n.currentLocale)) : {};
      actions.setGlobalData({ ...terms, ...local });
    },
  };
}
