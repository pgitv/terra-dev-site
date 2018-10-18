import loadSiteConfig from '../../../scripts/generate-app-config/loadSiteConfig';
import generatePagesConfig from '../../../scripts/generate-app-config/generatePagesConfig';

const baseRouteOfExample = (siteConfig, pageKey) => {
  const baseRouteLink = siteConfig.navConfig.navigation.links.find(link => link.pageTypes.includes(pageKey));
  return baseRouteLink ? baseRouteLink.path : null;
};

const traversePathsFromTree = (currentPage, currentRoute, groupingDirectory = null) => {
  describe(currentPage.name, () => {
    if (currentPage.pages == null) {
      beforeEach(() => {
        browser.url(`/#/raw${currentRoute}${currentPage.path}`);
      });
      Terra.should.beAccessible();
      Terra.should.matchScreenshot({ groupingDirectory });
    } else {
      currentPage.pages.forEach(mappedPage => traversePathsFromTree(mappedPage, `${currentRoute}${currentPage.path}`, currentPage.name));
    }
  });
};

const wdioTestDevSiteSnapshots = (options) => {
  const siteConfig = loadSiteConfig();
  const pagesConfig = generatePagesConfig(siteConfig, true, false);

  Object.entries(pagesConfig).forEach((pagesEntry) => {
    const pageKey = pagesEntry[0];
    const baseRoute = baseRouteOfExample(siteConfig, pageKey);
    if (siteConfig.wdioPageTypes.includes(pageKey) && baseRoute) {
      pagesEntry[1].forEach((page) => {
        if (!options.package || page.path.includes(`/${options.package}/`)) {
          traversePathsFromTree(page, baseRoute);
        }
      });
    }
  });
};

export default wdioTestDevSiteSnapshots;
