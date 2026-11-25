import React from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type { Props } from '@theme/DocSidebar/Desktop';
import { FloatingDockHome } from 'plantasia.space-design/react';
import styles from '@docusaurus/theme-classic/lib/theme/DocSidebar/Desktop/styles.module.css';

/** Docusaurus's desktop sidebar, plus Orchidea's home at its foot: its button docks there. */
function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props) {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig();
  const { siteConfig, i18n } = useDocusaurusContext();
  // Only where the assistant runs (a build with root behind it).
  const assistant = Boolean(siteConfig.customFields?.rootBase);
  return (
    <div className={clsx(styles.sidebar, hideOnScroll && styles.sidebarWithHideableNavbar, isHidden && styles.sidebarHidden)}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      {assistant ? (
        <div className="orchidea-docs-home-row">
          <FloatingDockHome name="docs-orchidea" returnLabel={i18n.currentLocale === 'es' ? 'Traer a Orchidea' : 'Bring Orchidea back'} />
        </div>
      ) : null}
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
