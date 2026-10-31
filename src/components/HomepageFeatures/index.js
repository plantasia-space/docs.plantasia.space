import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import PlantasiaSymbol from '@site/static/img/sidebar-icons/plantasia-logo.svg';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Plantasia Space',
    titleId: 'homepage.features.plantasia_space',
    description: 'Get started with the platform — its vision, core concepts, and how everything connects.',
    descriptionId: 'homepage.features.plantasia_space.description',
    // The symbol, drawn inline in the text colour (the same file as the sidebar's).
    symbol: true,
    link: '/docs/plantasia-space/',
  },
  {
    title: 'Audios',
    titleId: 'homepage.features.audios',
    description: 'Release, edit, and interact with your tracks and soundscapes.',
    descriptionId: 'homepage.features.audios.description',
    image: 'https://herbarium.plantasia.space/assets/symbols/current/track.svg',
    link: '/docs/audios',
  },
  {
    title: 'Entangled Worlds',
    titleId: 'homepage.features.entangled-worlds',
    description: 'Release, edit, and explore immersive, interactive worlds.',
    descriptionId: 'homepage.features.entangled-worlds.description',
    image: 'https://herbarium.plantasia.space/assets/symbols/current/entangled-world.svg',
    link: '/docs/entangled-worlds',
  },
  {
    title: 'Orbiters',
    titleId: 'homepage.features.orbiters',
    description: 'Release, edit, and interact with Orbiters across the ecosystem.',
    descriptionId: 'homepage.features.orbiters.description',
    image: 'https://herbarium.plantasia.space/assets/symbols/current/orbiter.svg',
    link: '/docs/orbiters',
  },
  {
    title: 'Collections',
    titleId: 'homepage.features.collections',
    description: 'Group your tracks, worlds, and orbiters into curated collections.',
    descriptionId: 'homepage.features.collections.description',
    image: 'https://herbarium.plantasia.space/assets/symbols/current/collection.svg',
    link: '/docs/collections',
  },
];

function Feature({ image, symbol, title, titleId, description, descriptionId, link }) {
  return (
    <Link to={link} className={styles.featureCard}>
      <div className={styles.featureIcon}>
        {symbol ? (
          <PlantasiaSymbol className={styles.featureSvg} role="img" aria-label={translate({message: title, id: titleId})} />
        ) : (
          <img
            src={image}
            className={clsx(styles.featureSvg, 'invert-on-dark')}
            alt={translate({message: title, id: titleId})}
            width="96"
            height="96"
            loading="lazy"
          />
        )}
      </div>
      <div className={styles.featureContent}>
        <Heading as="h3" className={styles.featureTitle}>
          <Translate id={titleId}>{title}</Translate>
        </Heading>
        <p className={styles.featureDescription}>
          <Translate id={descriptionId}>{description}</Translate>
        </p>
      </div>
    </Link>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresList}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
