import MockComponent from './MockComponent';

const componentConfig = {
  'mock-tests-1': {
    name: 'Single Test Page',
    path: '/mock-tests-1',
    tests: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
  },
  'mock-tests-2': {
    name: 'Multiple Test Pages',
    path: '/mock-tests-2',
    tests: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
      {
        name: 'Index 2',
        path: '/index-2',
        component: MockComponent,
      },
    ],
  },
  'mock-tests-3': {
    name: 'Nested Tests Pages',
    path: '/mock-tests-3',
    tests: [
      {
        name: 'First Layer',
        path: '/first-layer',
        tests: [
          {
            name: 'Nested',
            path: '/nested',
            component: MockComponent,
          },
        ],
      },
    ],
  },
  'mock-tests-4': {
    name: 'Test Page with Custom Placeholder',
    path: '/mock-tests-4',
    component: MockComponent,
    tests: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
    ],
  },
  'mock-tests-5': {
    name: 'Nested Test Page with Custom Placeholders',
    path: '/mock-tests-5',
    tests: [
      {
        name: 'First Layer',
        path: '/first-layer',
        component: MockComponent,
        tests: [
          {
            name: 'Nested',
            path: '/nested',
            component: MockComponent,
          },
        ],
      },
    ],
  },
};

export default componentConfig;
