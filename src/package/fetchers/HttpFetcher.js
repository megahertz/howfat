'use strict';

const Fetcher = require('./Fetcher');

class HttpFetcher extends Fetcher {
  /** @type {TarballReader} */
  tarballReader;

  /**
   * @param {object} options
   * @param {TarballReader} options.tarballReader
   */
  constructor({ tarballReader }) {
    super();
    this.tarballReader = tarballReader;
  }

  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { versionSpec }) {
    const stats = await this.tarballReader.readUrl(versionSpec);
    this.updatePackageByStats(pkg, stats);
    return pkg;
  }

  /**
   * @param {Package} pkg
   * @param {TarballStat} stats
   * @protected
   */
  updatePackageByStats(pkg, stats) {
    const packageJson = stats.packageJson;

    if (!pkg.name) {
      pkg.name = packageJson.name;
    }

    pkg.version = packageJson.version;
    pkg.dependencies = this.extractDependencies(packageJson);
    pkg.stats = stats;
    pkg.requirements = this.extractRequirements(packageJson);
  }
}

module.exports = HttpFetcher;
