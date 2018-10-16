import path from 'path';
import { loadTranslationObject, mountWithIntl } from 'enzyme-react-intl';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import aggregateTranslations from 'terra-toolkit/scripts/aggregate-translations/aggregate-translations';
import loadSiteConfig from '../../../scripts/generate-app-config/loadSiteConfig';
import generatePagesConfig from '../../../scripts/generate-app-config/generatePagesConfig';

const jestTestDevSiteSnapshots = () => {
  aggregateTranslations();
  Enzyme.configure({ adapter: new Adapter() });
  const { messages } = require(path.join(process.cwd(), 'aggregated-translations/en-US'));
  loadTranslationObject(messages);

  const siteConfig = loadSiteConfig();
  const pagesConfig = generatePagesConfig(siteConfig, true, false);

  Object.entries(pagesConfig).forEach((pagesEntry) => {
    if (siteConfig.jestPageTypes.includes(pagesEntry[0])) {
      pagesEntry[1].forEach((pageConfig) => {
        describe(pageConfig.name, () => {
          it(pageConfig.name, () => {
            const testPage = require(pageConfig.filePath).default();
            expect(mountWithIntl(testPage)).toMatchSnapshot();
          });
        });
      });
    }
  });
};

export default jestTestDevSiteSnapshots;
