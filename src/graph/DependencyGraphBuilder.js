'use strict';

const { EventEmitter } = require('events');

class DependencyGraphBuilder extends EventEmitter {
  /**
   * @param {IOptions} options
   * @param {IGetPkgMeta} getPkgMeta
   * @param {IGetPkgStat} getPkgStat
   * @param {IPackageFactory} packageFactory
   * @param {DependencyCache} cache
   */
  constructor(options, getPkgMeta, getPkgStat, packageFactory, cache) {
    super();

    /** @type {IOptions} */
    this.options = options;

    /** @type {IGetPkgMeta} */
    this.getPkgMeta = getPkgMeta;

    /** @type {IGetPkgStat} */
    this.getPkgStat = getPkgStat;

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
    this.emit('fetch-meta', pkg.url, pkg);
    const meta = await this.getPkgMeta(pkg.url);

    pkg.addPackageInformation(meta, this.packageFactory);

    if (pkg.fileCount < 1 && pkg.tarballUrl) {
      this.emit('fetch-stat', pkg.tarballUrl, pkg);
      const stat = await this.getPkgStat(pkg.tarballUrl);
      pkg.fileCount = stat.fileCount;
      pkg.unpackedSize = stat.unpackedSize;
    }

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
