import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {useEffect} from 'react';

import styles from './index.module.css';

function HeroSection(): ReactNode {
  return (
    <section className={styles.hero}>
      {/* Left column */}
      <div>
        <p className={styles.heroEyebrow}>OPENAPI FOR GO</p>
        <h1 className={styles.heroTitle}>
          Framework-<em>agnostic</em>
          <br />
          API docs.
        </h1>
        <p className={styles.heroSub}>
          Build OpenAPI 3.x specs in pure Go. No annotations, no code comments.
          Test-driven, always in sync with what your API actually does.
        </p>
        <div className={styles.heroCtas}>
          <Link className={styles.btnPrimary} to="/docs/spec/introduction">
            Get started →
          </Link>
          <a
            className={styles.btnOutline}
            href="https://github.com/oaswrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Right column: macOS-style code panel */}
      <div className={styles.heroCode}>
        <div className={styles.codeHeader}>
          <div className={`${styles.dot} ${styles.dotR}`} />
          <div className={`${styles.dot} ${styles.dotY}`} />
          <div className={`${styles.dot} ${styles.dotG}`} />
          <span className={styles.codeFile}>main.go</span>
        </div>
        <pre className={styles.codePre}>
          <span className={styles.cKw}>{'package'}</span>{' main\n\n'}
          <span className={styles.cKw}>{'import'}</span>{' (\n'}
          {'  '}
          <span className={styles.cStr}>"github.com/oaswrap/spec"</span>
          {'\n  '}
          <span className={styles.cStr}>"github.com/oaswrap/spec/option"</span>
          {'\n)\n\n'}
          <span className={styles.cKw}>{'func'}</span>{' '}
          <span className={styles.cCyan}>{'main'}</span>{'() {\n'}
          {'  r := spec.'}
          <span className={styles.cCyan}>{'NewRouter'}</span>
          {'(\n    option.'}
          <span className={styles.cCyan}>{'WithTitle'}</span>
          {'('}
          <span className={styles.cStr}>"My API"</span>
          {'),\n    option.'}
          <span className={styles.cCyan}>{'WithVersion'}</span>
          {'('}
          <span className={styles.cStr}>"1.0.0"</span>
          {'),\n  )\n\n  r.'}
          <span className={styles.cCyan}>{'Get'}</span>
          {'('}
          <span className={styles.cStr}>"/users/</span>
          {'{'}<span className={styles.cStr}>id</span>{'}'}<span className={styles.cStr}>"</span>
          {',\n    option.'}
          <span className={styles.cCyan}>{'Summary'}</span>
          {'('}
          <span className={styles.cStr}>"Get user"</span>
          {'),\n    option.'}
          <span className={styles.cCyan}>{'Response'}</span>
          {'(200, '}
          <span className={styles.cKw}>{'new'}</span>
          {'(User)),\n  )\n\n  '}
          <span className={styles.cMuted}>{'// Write spec to file'}</span>
          {'\n  r.'}
          <span className={styles.cCyan}>{'WriteSchemaTo'}</span>
          {'('}
          <span className={styles.cStr}>"openapi.yaml"</span>
          {')\n}'}
        </pre>
      </div>
    </section>
  );
}

function PackageStrip(): ReactNode {
  return (
    <div className={styles.pkgStrip}>
      <span className={styles.pkgLabel}>PACKAGES —</span>
      <Link className={styles.pkgItem} to="/docs/spec/introduction">
        <div className={styles.pkgDot} />
        spec — OpenAPI builder
      </Link>
      <Link className={styles.pkgItem} to="/docs/gswag/introduction">
        <div className={styles.pkgDot} />
        gswag — test-driven docs
      </Link>
      <Link className={styles.pkgItem} to="/docs/spec-ui/introduction">
        <div className={styles.pkgDot} />
        spec-ui — documentation UIs
      </Link>
    </div>
  );
}

const features = [
  {
    num: '01',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" fill="#0891b2" />
        <rect x="9" y="2" width="5" height="5" rx="1" fill="#0891b2" opacity="0.4" />
        <rect x="2" y="9" width="5" height="5" rx="1" fill="#0891b2" opacity="0.4" />
        <rect x="9" y="9" width="5" height="5" rx="1" fill="#0891b2" opacity="0.6" />
      </svg>
    ),
    title: 'Code-first spec generation',
    body: 'Build OpenAPI 3.x specs in pure Go with full type safety. Works with any framework or standalone for CI/CD pipelines.',
  },
  {
    num: '02',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Test-driven documentation',
    body: 'Generate specs as a side-effect of your Ginkgo integration tests. Real HTTP requests mean zero drift.',
  },
  {
    num: '03',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5" stroke="#0891b2" strokeWidth="1.5" />
        <path d="M8 3v5l3 2" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Multiple UI providers',
    body: 'Swagger UI, Stoplight, ReDoc, Scalar, or RapiDoc. Switch providers by changing a single import. CDN or air-gapped.',
  },
];

function FeaturesSection(): ReactNode {
  return (
    <section className={styles.featuresSection}>
      <p className={styles.sectionLabel}>CAPABILITIES</p>
      <div className={styles.featureGrid}>
        {features.map((f) => (
          <div key={f.num} className={styles.feat}>
            <div className={styles.featNum}>{f.num}</div>
            <div className={styles.featIcon}>{f.icon}</div>
            <h3 className={styles.featTitle}>{f.title}</h3>
            <p className={styles.featBody}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CustomFooter(): ReactNode {
  return (
    <div className={styles.footerWrap}>
      <div className={styles.footerGrid}>
        <div className={styles.footCol}>
          <h4>LIBRARIES</h4>
          <a href="https://github.com/oaswrap/spec" target="_blank" rel="noopener noreferrer">
            spec ↗
          </a>
          <a href="https://github.com/oaswrap/spec-ui" target="_blank" rel="noopener noreferrer">
            spec-ui ↗
          </a>
          <a href="https://github.com/oaswrap/gswag" target="_blank" rel="noopener noreferrer">
            gswag ↗
          </a>
        </div>
        <div className={styles.footCol}>
          <h4>API REFERENCE</h4>
          <a href="https://pkg.go.dev/github.com/oaswrap/spec" target="_blank" rel="noopener noreferrer">
            pkg.go.dev/spec ↗
          </a>
          <a href="https://pkg.go.dev/github.com/oaswrap/spec-ui" target="_blank" rel="noopener noreferrer">
            pkg.go.dev/spec-ui ↗
          </a>
          <a href="https://pkg.go.dev/github.com/oaswrap/gswag" target="_blank" rel="noopener noreferrer">
            pkg.go.dev/gswag ↗
          </a>
        </div>
        <div className={styles.footCol}>
          <h4>MORE</h4>
          <a href="https://github.com/oaswrap" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
      <div className={styles.footBottom}>© 2026 OASWrap — built with Docusaurus</div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'OASWrap',
      description: 'Framework-agnostic OpenAPI documentation for Go',
      url: 'https://oaswrap.github.io',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'OASWrap',
        url: 'https://github.com/oaswrap',
      },
    });
    document.head.appendChild(schemaScript);
    return () => {
      document.head.removeChild(schemaScript);
    };
  }, []);

  return (
    <Layout
      title={siteConfig.title}
      description="Framework-agnostic OpenAPI documentation for Go"
      noFooter
    >
      <div className={styles.page}>
        <HeroSection />
        <PackageStrip />
        <FeaturesSection />
        <CustomFooter />
      </div>
    </Layout>
  );
}
