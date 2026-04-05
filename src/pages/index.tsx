import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Framework Agnostic',
    description: (
      <>
        Works with any Go web framework — Chi, Echo, Gin, Fiber, net/http, and
        more. Or use it standalone for build-time spec generation.
      </>
    ),
  },
  {
    title: 'Multiple UI Providers',
    description: (
      <>
        Serve interactive API documentation with Swagger UI, Stoplight Elements,
        ReDoc, Scalar, or RapiDoc. Switch providers by changing a single import.
      </>
    ),
  },
  {
    title: 'CI/CD Ready',
    description: (
      <>
        Generate OpenAPI 3.x specs at build time from pure Go code with full
        type safety. No annotations, no code comments — just Go.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md padding-vert--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/spec/introduction">
            spec — OpenAPI Builder
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/spec-ui/introduction">
            spec-ui — Documentation UIs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Framework-agnostic OpenAPI documentation for Go">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
