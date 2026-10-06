import React from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Hero banner image for the blog landing page.
// TODO: swap for a wide banner from the Plantasia image library.
// A landscape image (e.g. ~1600x500) works best; square images are cropped to fit.
const BANNER_IMAGE = '/img/regenerative.png';

// The What's new page (a second blog instance) shares this list page; it takes its own title.
function isWhatsNew({metadata}) {
  return metadata.permalink.replace(/^\/es(?=\/)/, '').startsWith('/whats-new');
}

function BlogHero(props) {
  const {blogTitle, blogDescription} = props.metadata;
  const whatsNew = isWhatsNew(props);
  return (
    <header className={styles.blogHero}>
      <img
        className={styles.blogHeroImage}
        src={BANNER_IMAGE}
        alt=""
        aria-hidden="true"
        loading="eager"
      />
      <div className={styles.blogHeroInner}>
        <Heading as="h1" className={styles.blogHeroTitle}>
          {whatsNew ? blogTitle : <Translate id="blog.hero.title">Plantasia Space Blog</Translate>}
        </Heading>
        <p className={styles.blogHeroSubtitle}>
          {whatsNew ? blogDescription : (
            <Translate id="blog.hero.subtitle">
              News, updates, and stories from the regenerative aural community.
            </Translate>
          )}
        </p>
      </div>
    </header>
  );
}

// Only render the hero on the first listing page (not on paginated /blog/page/N).
function isFirstBlogListPage({metadata}) {
  return metadata.page === undefined || metadata.page === 1;
}

function BlogListPageMetadata(props) {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

export default function BlogListPage(props) {
  const {metadata, items, sidebar} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <Layout>
        {isFirstBlogListPage(props) && <BlogHero {...props} />}
        <div className="container margin-vert--lg">
          <div className="row">
            <BlogSidebar sidebar={sidebar} />
            <main
              className={clsx('col', {
                'col--7': hasSidebar,
                'col--9 col--offset-1': !hasSidebar,
              })}>
              <BlogPostItems items={items} />
              <BlogListPaginator metadata={metadata} />
            </main>
          </div>
        </div>
      </Layout>
    </HtmlClassNameProvider>
  );
}
