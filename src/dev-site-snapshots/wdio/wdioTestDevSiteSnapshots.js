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
    const {
      viewports,
      selector,
      themeableProperties,
      steps,
    // eslint-disable-next-line global-require, import/no-dynamic-require
    } = fs.existsSync(metadataFile) ? require(metadataFile).default : {};
    const viewportObject = {};
    (viewports || VIEWPORT_KEYS).forEach((viewport) => {
      viewportObject[viewport] = [{
        name: currentPage.name,
        groupingDirectory,
        selector,
        url: `/#/raw${currentRoute}${currentPage.path}`,
        themeableProperties,
        steps,
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
  (test.steps || [{}]).forEach((step, index) => {
    describe(test.name, () => {
      global.before(() => {
        if (step.refreshUrl || index === 0) {
          global.browser.url(test.url);
        }
        if (step.action) {
          step.action();
        }
      });
      const matchScreenshotArgs = step.name ? [step.name] : [];
      matchScreenshotArgs.push({ groupingDirectory: test.groupingDirectory, selector: step.selector || test.selector });
      global.Terra.should.matchScreenshot(...matchScreenshotArgs);
      global.Terra.should.beAccessible();
    });
  });

  (test.steps || [{}]).forEach((step, index) => {
    if (step.themeableProperties || test.themeableProperties) {
      describe(test.name, () => {
        global.before(() => {
          if (step.refreshUrl || index === 0) {
            global.browser.url(test.url);
          }
          if (step.action) {
            step.action();
          }
        });
        global.Terra.should.themeCombinationOfCustomProperties({
          testName: step.name ? `themed-${step.name}` : 'themed',
          selector: step.selector || test.selector,
          groupingDirectory: test.groupingDirectory,
          properties: step.themeableProperties || test.themeableProperties,
        });
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
