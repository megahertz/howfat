'use strict';

const {
  filterReleases,
  getLatestVersion,
} = require('../../utils/spec');
const Fetcher = require('./Fetcher');

const META_FIELDS = ['author', 'description', 'license', 'maintainers', 'time'];

class NpmFetcher extends Fetcher {
  /** @type {HttpClient} */
  #httpClient;

  /** @type {string} */
  #registryUrl;

  /** @type {TarballReader} */
  #tarballReader;

  /**
   * @param {object} options
   * @param {HttpClient} options.httpClient
   * @param {string} options.registryUrl
   * @param {TarballReader} options.tarballReader
   */
  constructor({
    httpClient,
    registryUrl = 'https://registry.npmjs.org/',
    tarballReader,
  }) {
    super();
    this.#httpClient = httpClient;
    this.#registryUrl = registryUrl;
    this.#tarballReader = tarballReader;
  }

  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { escapedName }) {
    const packageMetaUrl = this.#registryUrl + escapedName;
    let packageFullMeta;

    try {
      packageFullMeta = await this.#httpClient.get(packageMetaUrl);
    } catch (error) {
      if (error.response?.status === 404) {
        pkg.setError({
          error,
          reason: 'not-found',
          message: 'Package not found',
        });

        return pkg;
      }

      throw error;
    }

    pkg.version = this.extractVersion(pkg, packageFullMeta);

    const packageJson = packageFullMeta.versions[pkg.version];

    pkg.dependencies = this.extractDependencies(packageJson);
    pkg.stats = this.extractStats(packageJson);
    pkg.requirements = this.extractRequirements(packageJson);

    for (const f of META_FIELDS) {
      pkg.fields[f] = JSON.stringify(packageFullMeta[f] || '')
        .replace(/"/g, '');
    }

    if (!pkg.hasStats()) {
      pkg.stats = await this.fetchStats(packageJson.dist.tarball);
    }

    return pkg;
  }

  /**
   * @param {string} url
   * @return {Promise<Stats>}
   * @protected
   */
  async fetchStats(url) {
    if (url) {
      return this.#tarballReader.readUrl(url);
    }

    return { fileCount: 0, unpackedSize: 0 };
  }

  /**
   * @param {object} packageJson
   * @param {object} packageJson.dist
   * @param {string} packageJson.dist.tarball
   * @param {number} packageJson.dist.fileCount
   * @param {number} packageJson.dist.unpackedSize
   * @return {Stats}
   * @private
   */
  extractStats(packageJson) {
    let stats = {
      fileCount: -1,
      unpackedSize: -1,
    };

    const dist = packageJson.dist || {};

    if (dist.fileCount !== undefined && dist.unpackedSize !== undefined) {
      stats = {
        fileCount: dist.fileCount,
        unpackedSize: dist.unpackedSize,
      };
    }

    return stats;
  }

  /**
   * Return the exact version based on versionSpec and available versions
   * @param {Package} pkg
   * @param {any} packageMeta
   * @param {any} packageMeta.versions
   * @param {any} packageMeta['dist-tags']
   * @return {string}
   * @private
   */
  extractVersion(pkg, packageMeta) {
    let versionSpec = pkg.versionSpec || '*';
    if (versionSpec === 'latest') {
      versionSpec = '*';
    }

    const availableVersions = Object.keys(packageMeta.versions || {});
    let version = getLatestVersion(availableVersions, versionSpec);
    if (version) {
      return version;
    }

    const hasReleases = filterReleases(availableVersions).length > 0;

    if (versionSpec === '*' && !hasReleases && packageMeta['dist-tags']) {
      version = packageMeta['dist-tags'] && packageMeta['dist-tags'].latest;
    }

    if (version) {
      return version;
    }

    throw Error(`Could not find a satisfactory version for ${pkg}`);
  }
}

module.exports = NpmFetcher;
