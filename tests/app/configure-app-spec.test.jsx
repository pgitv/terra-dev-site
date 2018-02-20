import React from 'react';
import configureApp from '../../src/app/configureApp';
import defaultSiteConfig from '../../src/config/site.config';
import MockComponent from './MockComponent';
// import mockComponentConfig from './mock-component-config';
import mockComponentConfig from './mock-component-config-pages';
// import mockCCPages from './mock-component-config-pages';
// import mockCCTests from './mock-component-config-tests';
// import mockCCPagesTests from './mock-component-config-pages-tests';
// import mockNavigation from './mock-navigation';

jest.mock('../../src/app/components/Home', () => () => {});
jest.mock('./MockComponent', () => () => {});
const rootPath = '/site';
const exampleType = 'pages';
// const componentConfigs = [mockComponentConfig, mockCCPages, mockCCTests, mockCCPagesTests];

const assertNavigation = (navigation, expectedNavigation) => {
  expect(navigation).toMatchObject(expectedNavigation);
};

const assertMenuLinks = (routeConfig, expectedNavigation) => {
  console.log(routeConfig.menu)
  expect(routeConfig).toHaveProperty(`menu.${rootPath}.component.tiny.props.links`, expectedNavigation.links);
  expect(routeConfig).toHaveProperty(`menu.${rootPath}.component.small.props.links`, expectedNavigation.links);
};

const assertContentRoutes = (routeConfig, expectedRoutes) => {
  expect(Object.keys(routeConfig.content).length).toBe(expectedRoutes.numberMenuLinks);
};

const testRoutesAndNavigation = (siteConfig, expectedRoutes, expectedNavigation) => {
  const { routeConfig, navigation } = configureApp(siteConfig, mockComponentConfig);
  assertContentRoutes(routeConfig, expectedRoutes);
  assertMenuLinks(routeConfig, expectedNavigation);
  assertNavigation(navigation, expectedNavigation);
};

describe('configureApp', () => {
  let siteConfig;
  beforeEach(() => {
    const baseNavigation = {
      rootPath,
      navigation: {},
    };
    siteConfig = Object.assign({}, defaultSiteConfig, { navConfig: baseNavigation });
  });

  it('handles an empty navigation object', () => {
    const expectedNavigation = {
      index: undefined, links: [], extensions: undefined,
    };
    testRoutesAndNavigation(siteConfig, { numberMenuLinks: 0 }, expectedNavigation);
  });

  it('handles the index key', () => {
    siteConfig.navConfig.navigation.index = '/site/mock';
    const expectedNavigation = {
      index: '/site/mock', links: [], extensions: undefined,
    };
    testRoutesAndNavigation(siteConfig, { numberMenuLinks: 0 }, expectedNavigation);
  });

  it('handles the extensions key', () => {
    siteConfig.navConfig.navigation.extensions = MockComponent;
    const expectedNavigation = {
      index: undefined, links: [], extensions: MockComponent,
    };
    testRoutesAndNavigation(siteConfig, { numberMenuLinks: 0 }, expectedNavigation);
  });

  describe('handles the links key', () => {
    const expectedRoutes = {
      numberMenuLinks: 0,
    };

    const expectedNavigation = {
      index: undefined,
      links: [],
      extensions: undefined,
    };

    it('does not create a link with only path', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('does not create a link with only a name', () => {
      siteConfig.navConfig.navigation.links = [{
        text: 'Mock',
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('does not create a link with only an exampleType', () => {
      siteConfig.navConfig.navigation.links = [{
        exampleType,
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('does not create a link without an exampleType', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('does not create a link without an name', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        exampleType,
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('does not create a link without an path', () => {
      siteConfig.navConfig.navigation.links = [{
        text: 'Mock',
        exampleType,
      }];

      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('creates a link with the default component', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType,
      }];
      expectedRoutes.numberMenuLinks = 1;
      expectedNavigation.links = [{
        path: '/site/mock',
        text: 'Mock',
      }];
      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
      // const { routeConfig } = configureApp(siteConfig, mockComponentConfig);
      // expect(routeConfig.content['/site/mock'].component.default.componentClass()).toBeInstanceOf(MockComponent);
    });

    it('creates a link with a custom component', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType,
        component: MockComponent,
      }];
      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('creates a link with a sub nav indicator', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType,
        hasSubNav: true,
      }];
      expectedNavigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        hasSubNav: true,
      }];
      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });

    it('creates a link with a sub nav indicator and custom menu component', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType,
        hasSubNav: true,
        menuComponent: MockComponent,
      }];
      testRoutesAndNavigation(siteConfig, expectedRoutes, expectedNavigation);
    });
  });
  //
  // it('should create the expected navigation and route config', () => {
  //   // const { navigation } = configureApp(defaultSiteConfig, mockComponentConfig);
  //   // expect(navigation).toMatchObject(mockNavigation);
  //   assertNavigation(siteConfig, mockNavigation);
  // });
});
