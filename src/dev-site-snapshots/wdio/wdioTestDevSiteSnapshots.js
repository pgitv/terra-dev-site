import loadSiteConfig from '../../../scripts/generate-app-config/loadSiteConfig';
import generatePagesConfig from '../../../scripts/generate-app-config/generatePagesConfig';

const baseRouteOfExample = (siteConfig, pageKey) => {
  const baseRouteLink = siteConfig.navConfig.navigation.links.find(link => link.pageTypes.includes(pageKey));
  return baseRouteLink ? baseRouteLink.path : null;
};

const traversePathsFromTree = (currentPage, currentRoute) => {
  if (currentPage.pages == null) {
    describe(currentPage.name, () => {
      beforeEach(() => {
        browser.url(`/#/raw${currentRoute}${currentPage.path}`);
      });
      Terra.should.beAccessible();
      Terra.should.matchScreenshot();
    });
  } else {
    currentPage.pages.map(mappedPage => traversePathsFromTree(mappedPage, `${currentRoute}${currentPage.path}`));
  }
};

const wdioTestDevSiteSnapshots = () => {
  const siteConfig = loadSiteConfig();
  const pagesConfig = generatePagesConfig(siteConfig, true, false);

  Object.entries(pagesConfig).forEach((pagesEntry) => {
    const pageKey = pagesEntry[0];
    const baseRoute = baseRouteOfExample(siteConfig, pageKey);
    if (siteConfig.wdioPageTypes.includes(pageKey) && baseRoute) {
      pagesEntry[1].map(page => traversePathsFromTree(page, baseRoute));
    }
  });
};

export default wdioTestDevSiteSnapshots;
