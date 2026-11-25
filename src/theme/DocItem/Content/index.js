import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import { resolveIcon, ICON_STROKE } from '../../utils/iconResolver';
import CopyMarkdownButton from '@site/src/components/CopyMarkdownButton';

export default function DocItemContent({ children }) {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const showTitle = !frontMatter.hide_title;

  const iconName =
    frontMatter?.sidebar_custom_props?.icon || frontMatter?.customProps?.icon || null;
  const Icon = resolveIcon(iconName);

  const shouldHideContentH1 = Boolean(
    contentTitle && metadata?.title && contentTitle.trim() === metadata.title.trim(),
  );

  const iconClassName = 'docTitleIcon';

  return (
    <div
      className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown', {
        'docMarkdown--hideContentTitle': shouldHideContentH1,
      })}>
      {showTitle && (
        <header>
          <Heading as="h1" className={Icon ? 'docTitleWithIcon' : undefined}>
            {Icon ? <Icon className={iconClassName} size={24} strokeWidth={ICON_STROKE} /> : null}
            <span>{metadata?.title}</span>
          </Heading>
        </header>
      )}
      {metadata.id !== 'index' && (
        <div className="copy-markdown-btn-wrapper">
          <CopyMarkdownButton />
        </div>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
