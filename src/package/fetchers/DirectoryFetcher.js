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
    /** @type {string} */
    const packagePath = versionSpec;

    const content = await fs.promises.readFile(
      path.join(packagePath, 'package.json'),
      'utf8'
    );
    const packageJson = JSON.parse(content);

    if (!pkg.name) {
      pkg.name = packageJson.name;
    }

    pkg.localPath = packagePath;
    pkg.version = packageJson.version;
    pkg.dependencies = this.extractDependencies(packageJson);
    pkg.stats = await this.getDirStats(packagePath);
    pkg.requirements = this.extractRequirements(packageJson);

    return pkg;
  }

  /**
   *
   * @param {string} directory
   * @param {object} initial
   * @return {Promise<{ unpackedSize: number, fileCount: number }>}
   */
  async getDirStats(directory, initial = { fileCount: 0, unpackedSize: 0 }) {
    const files = await fs.promises.readdir(directory);

    const promises = files
      .filter(file => file !== 'node_modules')
      .map(async (file) => {
        const filePath = path.join(directory, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
          return this.getDirStats(filePath, initial);
        }

        initial.fileCount += 1;
        initial.unpackedSize += stat.size;
      });

    await Promise.all(promises);

    return initial;
  }
}

module.exports = DirectoryFetcher;
