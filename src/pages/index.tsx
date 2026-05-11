import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {useEffect} from 'react';

import styles from './index.module.css';

function HeroSection(): ReactNode {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span>Open Source</span>
            <span className={styles.heroBadgeDot}>·</span>
            <span>OpenAPI 3.x</span>
            <span className={styles.heroBadgeDot}>·</span>
            <span>Go</span>
          </div>
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
            <span className={styles.codeCursor} />
          </pre>
        </div>
      </div>
    </section>
  );
}

const ecoPackages = [
  {
    name: 'spec',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1.5" fill="#0891b2" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.4" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.4" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.6" />
      </svg>
    ),
    title: 'OpenAPI builder',
    desc: 'Build OpenAPI 3.x and 3.2 specs in pure Go. Code-first, type-safe, 9 framework adapters.',
    href: '/docs/spec/introduction',
  },
  {
    name: 'gswag',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 6h12M4 10h8M4 14h10" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Test-driven docs',
    desc: 'Generate specs as a side-effect of Ginkgo integration tests. Zero drift guaranteed.',
    href: '/docs/gswag/introduction',
  },
  {
    name: 'spec-ui',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="12" rx="2" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M3 8h14" stroke="#7c3aed" strokeWidth="1.5" />
        <circle cx="6.5" cy="6" r="1" fill="#7c3aed" />
        <circle cx="9.5" cy="6" r="1" fill="#7c3aed" opacity="0.5" />
      </svg>
    ),
    title: 'Documentation UIs',
    desc: 'Swagger UI, Stoplight, ReDoc, Scalar, or RapiDoc. Switch with a single import.',
    href: '/docs/spec-ui/introduction',
  },
];

function EcosystemSection(): ReactNode {
  return (
    <section className={styles.ecosystem}>
      <div className={styles.ecoInner}>
        <p className={styles.sectionLabel}>ECOSYSTEM</p>
        <div className={styles.ecoGrid}>
          {ecoPackages.map((pkg) => (
            <Link key={pkg.name} className={styles.ecoCard} to={pkg.href}>
              <div className={styles.ecoCardTop}>
                <div className={styles.ecoIcon}>{pkg.icon}</div>
                <code className={styles.ecoName}>{pkg.name}</code>
              </div>
              <p className={styles.ecoTitle}>{pkg.title}</p>
              <p className={styles.ecoDesc}>{pkg.desc}</p>
              <span className={styles.ecoLink}>View docs →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    num: '01',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#0891b2" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.4" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.4" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#0891b2" opacity="0.6" />
      </svg>
    ),
    title: 'Code-first spec generation',
    body: 'Build OpenAPI 3.x and 3.2 specs in pure Go with full type safety. chi, gin, echo, fiber, iris, net/http, gorilla/mux — or standalone for CI/CD.',
    href: '/docs/spec/introduction',
  },
  {
    num: '02',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4.5h14M2 9h9M2 13.5h11" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Test-driven documentation',
    body: 'Generate specs as a side-effect of your Ginkgo integration tests. Real HTTP requests mean zero drift.',
    href: '/docs/gswag/introduction',
  },
  {
    num: '03',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#0891b2" strokeWidth="1.5" />
        <path d="M9 3.5v5.5l3.5 2" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Multiple UI providers',
    body: 'Swagger UI, Stoplight, ReDoc, Scalar, or RapiDoc. Switch providers by changing a single import. CDN or air-gapped.',
    href: '/docs/spec-ui/introduction',
  },
  {
    num: '04',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L3 5v5c0 3.55 2.57 6.87 6 7.67C12.43 16.87 15 13.55 15 10V5L9 2z" stroke="#0891b2" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.5 9l2 2 3-3" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Built-in spec validation',
    body: 'Error, Warning, and Info severity levels. Catch missing fields, invalid references, and best-practice violations before deployment.',
    href: '/docs/spec/advanced',
  },
];

function FeaturesSection(): ReactNode {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>CAPABILITIES</p>
          <p className={styles.sectionSub}>Everything you need to ship accurate API docs.</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.num} className={styles.feat}>
              <div className={styles.featNum}>{f.num}</div>
              <div className={styles.featIcon}>{f.icon}</div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featBody}>{f.body}</p>
              <Link className={styles.featLink} to={f.href}>Learn more →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    num: '1',
    title: 'Install',
    code: 'go get github.com/oaswrap/spec',
    note: 'No code generation. No annotations.',
  },
  {
    num: '2',
    title: 'Define routes',
    code: 'r := spec.NewRouter(\n  option.WithTitle("My API"),\n)\nr.Get("/users/{id}",\n  option.Response(200, new(User)),\n)',
    note: 'Works with chi, gin, echo, fiber, net/http.',
  },
  {
    num: '3',
    title: 'Generate spec',
    code: 'r.WriteSchemaTo("openapi.yaml")',
    note: 'CI-ready. Plug into any UI provider.',
  },
];

function QuickStartSection(): ReactNode {
  return (
    <section className={styles.quickStart}>
      <div className={styles.quickInner}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>QUICK START</p>
          <p className={styles.sectionSub}>From zero to a working OpenAPI spec in three steps.</p>
        </div>
        <div className={styles.stepGrid}>
          {steps.map((s) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <pre className={styles.stepCode}>{s.code}</pre>
              <p className={styles.stepNote}>{s.note}</p>
            </div>
          ))}
        </div>
        <div className={styles.quickCta}>
          <Link className={styles.btnPrimary} to="/docs/spec/introduction">
            Read full docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCTA(): ReactNode {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalCtaInner}>
        <h2 className={styles.finalCtaTitle}>Start shipping accurate API docs today.</h2>
        <p className={styles.finalCtaSub}>
          Zero annotations. Zero drift. Just Go code and tests that already exist.
        </p>
        <div className={styles.finalCtaBtns}>
          <Link className={styles.btnCtaWhite} to="/docs/spec/introduction">
            Get started →
          </Link>
          <a
            className={styles.btnCtaOutline}
            href="https://github.com/oaswrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
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
        <EcosystemSection />
        <FeaturesSection />
        <QuickStartSection />
        <FinalCTA />
        <CustomFooter />
      </div>
    </Layout>
  );
}
