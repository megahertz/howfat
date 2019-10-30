'use strict';

const Package = require('../Package');
const Fetcher = require('./Fetcher');

class HttpFetcher extends Fetcher {
  /**
   * @param {HttpClient} httpClient
   * @param {GetTarballStats} getTarballStats
   */
  constructor(httpClient, getTarballStats) {
    super();
    this.httpClient = httpClient;
    this.getTarballStats = getTarballStats;
  }

  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { escapedName, versionSpec }) {
    const stats = await this.getTarballStats(versionSpec, this.httpClient);
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
