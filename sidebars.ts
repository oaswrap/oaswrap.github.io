import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'spec',
      link: {type: 'doc', id: 'spec/introduction'},
      items: [
        'spec/introduction',
        'spec/installation',
        'spec/quick-start',
        'spec/configuration',
        'spec/routing',
        'spec/parameters',
        'spec/security',
        'spec/advanced',
        'spec/faq',
        {
          type: 'category',
          label: 'Adapters',
          link: {type: 'doc', id: 'spec/adapters/overview'},
          items: [
            'spec/adapters/overview',
            'spec/adapters/chi',
            'spec/adapters/echo',
            'spec/adapters/gin',
            'spec/adapters/fiber',
            'spec/adapters/http',
            'spec/adapters/mux',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'spec-ui',
      link: {type: 'doc', id: 'spec-ui/introduction'},
      items: [
        'spec-ui/introduction',
        'spec-ui/installation',
        'spec-ui/quick-start',
        'spec-ui/configuration',
        'spec-ui/embedded-assets',
        'spec-ui/framework-integration',
        {
          type: 'category',
          label: 'UI Providers',
          link: {type: 'doc', id: 'spec-ui/providers/overview'},
          items: [
            'spec-ui/providers/overview',
            'spec-ui/providers/swagger-ui',
            'spec-ui/providers/stoplight',
            'spec-ui/providers/redoc',
            'spec-ui/providers/scalar',
            'spec-ui/providers/rapidoc',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
