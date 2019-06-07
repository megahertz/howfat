'use strict';

const fs                       = require('fs');
const path                     = require('path');
const DependenciesGraphBuilder = require('../DependencyGraphBuilder');
const DependencyCache          = require('../DependencyCache');
const downloaderFactory        = require('../downloaderFactory');
const packageFactory           = require('../package');
const { getFixtureName }       = require('./utils');

main(process.argv).catch(console.error);

function createFixture(packageName, dirName = null) {
  const options = { debug: true };

  if (!dirName) {
    dirName = getFixtureName(packageName);
  }

  const destDir = path.join(__dirname, 'fixtures', dirName);
  fs.mkdirSync(destDir);

  const downloader = downloaderFactory({ debug: options.debug });
  const builder = new DependenciesGraphBuilder(
    options,
    fixtureDownloader,
    packageFactory,
    new DependencyCache()
  );

  return builder.buildByPackageName(packageName);

  async function fixtureDownloader(url) {
    const content = await downloader(url);
    const fixtureName = getFixtureName(path.basename(url));

    fs.writeFileSync(path.resolve(destDir, fixtureName + '.json'), content);

    return content;
  }
}

async function main(argv) {
  if (argv.length < 3) {
    console.info('Usage: node createFixture.js PACKAGE[@version] [DIRNAME]');
    return;
  }

  await createFixture(argv[2], argv[3]);
  process.exit(0);
}
