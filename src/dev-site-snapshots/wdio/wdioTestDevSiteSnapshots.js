import path from 'path';
import fs from 'fs';
import SERVICE_DEFAULTS from 'terra-toolkit/config/wdio/services.default-config';
import loadSiteConfig from '../../../scripts/generate-app-config/loadSiteConfig';
import generatePagesConfig from '../../../scripts/generate-app-config/generatePagesConfig';

const VIEWPORT_KEYS = process.env.FORM_FACTOR ? [process.env.FORM_FACTOR] : Object.keys(SERVICE_DEFAULTS.terraViewports);

const baseRouteOfExample = (siteConfig, pageKey) => {
  const baseRouteLink = siteConfig.navConfig.navigation.links.find(link => link.pageTypes.includes(pageKey));
  return baseRouteLink ? baseRouteLink.path : null;
};

const mergeObjectOfArrays = (object1, object2) => {
  const mergedObject = {};
  VIEWPORT_KEYS.forEach((key) => {
    mergedObject[key] = (object1[key] || []).concat(object2[key] || []);
  });
  return mergedObject;
};

const createViewportObjectFromPageTree = (pageKey, currentPage, currentRoute, options = {}, groupingDirectory = null) => {
  if (!currentPage.pages) {
    const metadataFile = currentPage.filePath.replace(`.${pageKey}`, '.metadata');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { viewports, selector, themeableProperties } = fs.existsSync(metadataFile) ? require(metadataFile).default : {};
    const viewportObject = {};
    (viewports || VIEWPORT_KEYS).forEach((viewport) => {
      viewportObject[viewport] = [{
        name: currentPage.name,
        groupingDirectory,
        selector,
        url: `/#/raw${currentRoute}${currentPage.path}`,
        themeableProperties,
      }];
    });
    return viewportObject;
  }
  let viewportObject = {};
  currentPage.pages.forEach((subPage) => {
    const subViewportObject = createViewportObjectFromPageTree(pageKey, subPage, `${currentRoute}${currentPage.path}`, options, path.join(groupingDirectory || '', currentPage.name));
    viewportObject = mergeObjectOfArrays(viewportObject, subViewportObject);
  });
  return viewportObject;
};

const runTest = (test) => {
  describe(test.name, () => {
    global.beforeEach(() => {
      global.browser.url(test.url);
    });
    global.Terra.should.matchScreenshot({ groupingDirectory: test.groupingDirectory, selector: test.selector });
    global.Terra.should.beAccessible();
    if (test.themeableProperties) {
      global.Terra.should.themeCombinationOfCustomProperties({
        testName: 'themed',
        selector: test.selector,
        groupingDirectory: test.groupingDirectory,
        properties: test.themeableProperties,
      });
    }
  });
};

const wdioTestDevSiteSnapshots = (options = {}) => {
  const siteConfig = loadSiteConfig();
  const pagesConfig = generatePagesConfig(siteConfig, true, false);

  let viewportObject = {};
  Object.entries(pagesConfig).forEach((pagesEntry) => {
    const pageKey = pagesEntry[0];
    const baseRoute = baseRouteOfExample(siteConfig, pageKey);
    if (siteConfig.wdioPageTypes.includes(pageKey) && baseRoute) {
      pagesEntry[1].forEach((page) => {
        if (!options.package || page.path.includes(`/${options.package}/`)) {
          viewportObject = mergeObjectOfArrays(viewportObject, createViewportObjectFromPageTree(pageKey, page, baseRoute, options));
        }
      });
    }
  });

  console.log('Viewport Object', JSON.stringify(viewportObject, null, 2));

  Object.entries(viewportObject).forEach((viewportEntry) => {
    describe(viewportEntry[0], () => {
      global.before(() => {
        global.browser.setViewportSize(global.Terra.viewports(viewportEntry[0])[0]);
      });
      viewportEntry[1].forEach(test => runTest(test));
    });
  });
};

export default wdioTestDevSiteSnapshots;
