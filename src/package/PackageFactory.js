'use strict';

const DirectoryFetcher = require('./fetchers/DirectoryFetcher');
const NpmFetcher = require('./fetchers/NpmFetcher');
const Package = require('./Package');

class PackageFactory {
  /**
   * @param {HttpClient} httpClient
   * @param {GetTarballStats} getTarballStats
   */
  constructor(httpClient, getTarballStats) {
    this.fetchers = {
      directory: new DirectoryFetcher(),
      npm: new NpmFetcher(httpClient, getTarballStats),
    };
  }

  /**
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async create(dependencySpec) {
    const pkg = new Package(dependencySpec.name, dependencySpec.versionSpec);
    const source = dependencySpec.source;

    if (this.fetchers[source]) {
      return this.fetchers[source].fetch(pkg, dependencySpec);
    }

    throw new Error(
      `PackageFactory doesn't support ${source} source (${pkg})`
    );
  }

  /**
   * @param {DependencySpec} dependencySpec
   * @return {Package}
   */
  createUnresolved(dependencySpec) {
    return new Package(dependencySpec.name, dependencySpec.versionSpec);
  }
}

module.exports = PackageFactory;
