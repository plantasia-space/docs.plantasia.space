import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomeFigure from '@site/src/components/HomeFigure';
import Translate, {translate} from '@docusaurus/Translate';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">Comprehensive Documentation</Translate>
        </p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://plantasia.space/">
             𝕣ꫀᧁꫀꪀꫀ𝕣ꪖ𝕥ⅈꪜꫀ ꪑꪊડⅈᥴ
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({message: 'Plantasia Space — Documentation & Guides', id: 'homepage.metaTitle'})}
      description={translate({message: 'Official documentation for Plantasia Space — guides for Audios, Entangled Worlds, Orbiters, and Collections.', id: 'homepage.description'})}>
      <HomepageHeader />
      <HomeFigure />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
