import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import styles from './styles.module.css';

// The brand at the top left: the wordmark from the CDN, drawn as a mask so it takes the text colour
// (as an <img> it would paint its currentColor black). The navbar's title ("docs") follows it.
export default function Logo(props) {
  const {siteConfig} = useDocusaurusContext();
  const {navbar: {title: navbarTitle, logo}} = useThemeConfig();
  const {imageClassName, titleClassName, ...rest} = props;
  const href = useBaseUrl(logo?.href || '/');
  const wordmark = `${siteConfig.customFields.assetsBase}/assets/logos/current/plantasia-space-wordmark-currentcolor-transparent-background.svg`;
  return (
    <Link to={href} {...rest} {...(logo?.target && {target: logo.target})}>
      <span className={clsx(imageClassName, styles.brand)}>
        <span className={styles.wordmark} role="img" aria-label={siteConfig.title} style={{'--mark': `url(${wordmark})`}} />
      </span>
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
