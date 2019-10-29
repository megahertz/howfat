'use strict';

const fs = require('fs');
const path = require('path');
const Package = require('../Package');
const Fetcher = require('./Fetcher');

class DirectoryFetcher extends Fetcher {
  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { versionSpec }) {
    const content = await fs.promises.readFile(
      path.join(versionSpec, 'package.json')
    );
    const packageJson = JSON.parse(content);

    if (!pkg.name) {
      pkg.name = packageJson.name;
    }

    pkg.version = packageJson.version;
    pkg.dependencies = this.extractDependencies(packageJson);
    // TODO: implement
    pkg.stats = { fileCount: 0, unpackedSize: 0 };
    pkg.requirements = this.extractRequirements(packageJson);

    return pkg;
  }
}

module.exports = DirectoryFetcher;
