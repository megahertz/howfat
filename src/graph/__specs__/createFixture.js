const downloaderFactory        = require('../downloader');

function createFixture(packageName) {
  const downloader = downloaderFactory(null, { debug: true });
}
