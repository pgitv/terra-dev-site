const wdioTestDevSiteSnapshots = require('../../lib/dev-site-snapshots/wdio/wdioTestDevSiteSnapshots').default;

const viewports = ['tiny', 'small', 'medium', 'large', 'huge', 'enormous'];
const selector = '#root';

wdioTestDevSiteSnapshots({
  testFileConfig: {
    'Wdio Test Dev Site Snapshots': { viewports, selector },
  },
});
