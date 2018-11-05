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

const createViewportObjectFromPageTree = (pageKey, currentPage, currentRoute, options = {}) => {
  if (!currentPage.pages && options.testSetup.examples[currentPage.name]) {
    const viewportObject = {};
    const currentPageExample = options.testSetup.examples[currentPage.name];
    const exampleArray = Array.isArray(currentPageExample) ? currentPageExample : [currentPageExample];
    exampleArray.forEach((example) => {
      const {
        viewports,
        selector,
        themeableProperties,
        axeOptions,
        parentName,
        testName,
        themedTestName,
      } = example;
      (viewports || options.testSetup.viewports || VIEWPORT_KEYS).forEach((viewport) => {
        viewportObject[viewport] = [{
          parentName: parentName || options.testSetup.parentName || currentPage.name,
          testName: testName || options.testSetup.testName,
          themedTestName: themedTestName || options.testSetup.themedTestName,
          selector: selector || options.testSetup.selector,
          url: `/#/raw${currentRoute}${currentPage.path}`,
          themeableProperties: options.themeableProperties || themeableProperties,
          axeOptions: options.axeOptions || axeOptions,
        }];
      });
    });
    return viewportObject;
  }
  if (currentPage.pages) {
    let viewportObject = {};
    currentPage.pages.forEach((subPage) => {
      const subViewportObject = createViewportObjectFromPageTree(pageKey, subPage, `${currentRoute}${currentPage.path}`, options);
      viewportObject = mergeObjectOfArrays(viewportObject, subViewportObject);
    });
    return viewportObject;
  }
  return {};
};

const runTest = (test) => {
  describe(test.parentName, () => {
    global.before(() => {
      global.browser.url(test.url);
    });

    const matchScreenshotArguments = test.testName ? [test.testName, { selector: test.selector }] : [{ selector: test.selector }];
    global.Terra.should.matchScreenshot(...matchScreenshotArguments);
    global.Terra.should.beAccessible({ rules: test.axeOptions });

    if (test.themeableProperties) {
      global.Terra.should.themeCombinationOfCustomProperties({
        testName: test.themedTestName,
        selector: test.selector,
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

  Object.entries(viewportObject).forEach((viewportEntry) => {
    describe(viewportEntry[0], () => {
      global.before(() => {
        // Only set the form factor if the FORM_FACTOR environment variable is not set since that
        // is done elsewhere in terra-toolkit in that case
        if (!process.env.FORM_FACTOR) {
          global.browser.setViewportSize(global.Terra.viewports(viewportEntry[0])[0]);
        }
      });
      viewportEntry[1].forEach(test => runTest(test));
    });
  });
};

export default wdioTestDevSiteSnapshots;
