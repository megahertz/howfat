'use strict';

const { describe, expect, it } = require('humile');

const fs                     = require('fs');
const path                   = require('path');
const DependencyCache        = require('../DependencyCache');
const DependencyGraphBuilder = require('../DependencyGraphBuilder');
const packageFactory         = require('../package');
const { getFixtureName }     = require('./utils');

describe('DependencyGraphBuilder', () => {
  it('parses @webassemblyjs/helper-code-frame correctly', async () => {
    const name = '@webassemblyjs/helper-code-frame';
    const builder = createBuilder(name);
    const pkg = await builder.buildByPackageName(name);
    const stats = pkg.getStats();

    expect(stats).toEqual({
      depCount: 10,
      unpackedSize: 691071,
      fileCount: 96,
    });
  });
});

function createBuilder(packageName, options = {}) {
  const fixtureName = getFixtureName(packageName);

  return new DependencyGraphBuilder(
    options,
    fixtureDownloader,
    packageFactory,
    new DependencyCache()
  );

  function fixtureDownloader(url) {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      fixtureName,
      getFixtureName(path.basename(url)) + '.json'
    );

    return fs.promises.readFile(fixturePath, 'utf8');
  }
}
