import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import styles from './styles.module.css';

// The brand at the top left: the symbol and the wordmark from the CDN, each drawn as a mask so it
// takes the text colour (as an <img> it would paint its currentColor black). The navbar's title
// ("docs") follows them.
export default function Logo(props) {
  const {siteConfig} = useDocusaurusContext();
  const {navbar: {title: navbarTitle, logo}} = useThemeConfig();
  const {imageClassName, titleClassName, ...rest} = props;
  const href = useBaseUrl(logo?.href || '/');
  const logos = `${siteConfig.customFields.assetsBase}/assets/logos/current`;
  return (
    <Link to={href} {...rest} {...(logo?.target && {target: logo.target})}>
      <span className={clsx(imageClassName, styles.brand)} role="img" aria-label={siteConfig.title}>
        <span
          className={styles.symbol}
          style={{'--mark': `url(${logos}/plantasia-space-symbol-currentcolor-transparent-background.svg)`}}
        />
        <span
          className={styles.wordmark}
          style={{'--mark': `url(${logos}/plantasia-space-wordmark-currentcolor-transparent-background.svg)`}}
        />
      </span>
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
