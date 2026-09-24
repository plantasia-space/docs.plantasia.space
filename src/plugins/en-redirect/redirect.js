import React from 'react';
import { Redirect, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function EnRedirect() {
  const location = useLocation();
  const { siteConfig, i18n } = useDocusaurusContext();
  const prefix = `${siteConfig.baseUrl}${i18n.defaultLocale}`;
  const pathname = location.pathname.startsWith(prefix)
    ? siteConfig.baseUrl + location.pathname.slice(prefix.length).replace(/^\//, '')
    : location.pathname;
  const search = location.search || '';
  const hash = location.hash || '';

  return <Redirect to={`${pathname}${search}${hash}`} />;
}
