import loadSiteConfig from '../../../scripts/generate-app-config/loadSiteConfig';
import generatePagesConfig from '../../../scripts/generate-app-config/generatePagesConfig';

const baseRouteOfExample = (siteConfig, pageKey) => {
  const baseRouteLink = siteConfig.navConfig.navigation.links.find(link => link.pageTypes.includes(pageKey));
  return baseRouteLink ? baseRouteLink.path : null;
};

const wdioTestDevSiteSnapshots = () => {
  const siteConfig = loadSiteConfig();
  const pagesConfig = generatePagesConfig(siteConfig, true, false);

  Object.entries(pagesConfig).forEach((pagesEntry) => {
    const pageKey = pagesEntry[0];
    const baseRoute = baseRouteOfExample(siteConfig, pageKey);
    if (siteConfig.wdioPageTypes.includes(pageKey) && baseRoute) {
      pagesEntry[1].forEach((pageConfig) => {
        describe(pageConfig.name, () => {
          beforeEach(() => {
            browser.url(`/#/raw${baseRoute}${pageConfig.path}`);
          });
          Terra.should.beAccessible();
          Terra.should.matchScreenshot();
        });
      });
    }
  });
};

export default wdioTestDevSiteSnapshots;
