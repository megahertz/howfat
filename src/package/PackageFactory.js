'use strict';

const DirectoryFetcher = require('./fetchers/DirectoryFetcher');
const GitFetcher = require('./fetchers/GitFetcher');
const GithubFetcher = require('./fetchers/GithubFetcher');
const HttpFetcher = require('./fetchers/HttpFetcher');
const NpmFetcher = require('./fetchers/NpmFetcher');
const Package = require('./Package');

class PackageFactory {
  #fetchers = {};

  /**
   * @param {object} options
   * @param {HttpClient} options.httpClient
   * @param {string} [options.registryUrl]
   * @param {TarballReader} options.tarballReader
   */
  constructor({ httpClient, registryUrl, tarballReader }) {
    this.#fetchers = {
      directory: new DirectoryFetcher(),
      git: new GitFetcher(),
      github: new GithubFetcher({ tarballReader }),
      http: new HttpFetcher({ tarballReader }),
      npm: new NpmFetcher({ httpClient, registryUrl, tarballReader }),
    };
  }

  /**
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async create(dependencySpec) {
    const pkg = new Package(dependencySpec.name, dependencySpec.versionSpec);
    const source = dependencySpec.source;

    if (this.#fetchers[source]) {
      return this.#fetchers[source].fetch(pkg, dependencySpec);
    }

    throw new Error(
      `PackageFactory doesn't support ${source} source (${pkg})`,
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
