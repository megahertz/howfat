'use strict';

class DependencyGraphBuilder {
  /**
   * @param {IOptions} options
   * @param {IDownloader} downloader
   * @param {IPackageFactory} packageFactory
   * @param {DependencyCache} cache
   */
  constructor(options, downloader, packageFactory, cache) {
    /** @type {IOptions} */
    this.options = options;

    /** @type {IDownloader} */
    this.downloader = downloader;

    /** @type {IPackageFactory} */
    this.packageFactory = packageFactory;

    /** @type {DependencyCache} */
    this.cache = cache;
  }

  /**
   * @param {BasicPackage} pkg
   * @return {Promise<BasicPackage>}
   */
  async buildByPackage(pkg) {
    return this.fillPackageInformation(pkg);
  }

  /**
   * @param {string} name
   * @param {string} [version]
   * @return {Promise<BasicPackage>}
   */
  buildByPackageName(name, version = '') {
    const pkg = this.packageFactory(name, version, this.options);
    return this.buildByPackage(pkg);
  }

  /**
   * @param {BasicPackage} pkg
   * @private
   */
  async fillPackageInformation(pkg) {
    const json = JSON.parse(await this.downloader(pkg.url));

    pkg.addPackageInformation(json, this.packageFactory);

    this.cache.add(pkg);

    for (const dep of pkg.getDependenciesAsArray()) {
      const p = this.cache.find(dep.name, dep.versionSpec);

      if (p) {
        dep.isDuplicated = true;
        dep.version = p.version;
      } else {
        await this.fillPackageInformation(dep);
      }
    }

    return pkg;
  }
}

module.exports = DependencyGraphBuilder;
