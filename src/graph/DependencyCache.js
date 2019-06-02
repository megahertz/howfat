'use strict';

const semver = require('semver');

class DependencyCache {
  constructor() {
    this.cache = {};
  }

  /**
   * @param {BasicPackage} pkg
   */
  add(pkg) {
    if (!pkg.version) {
      // only package with filled information is accepted
      return;
    }

    this.cache[pkg.name] = this.cache[pkg.name] || [];
    this.cache[pkg.name].push(pkg);
  }

  /**
   * @param {string} name
   * @param {string} versionSpec
   * @return {BasicPackage}
   */
  find(name, versionSpec) {
    if (!this.cache[name]) {
      return null;
    }

    const satisfied = this.cache[name].filter((pkg) => {
      return semver.satisfies(pkg.version, versionSpec);
    });

    if (!satisfied) {
      return null;
    }

    if (satisfied.length === 1) {
      return satisfied[0];
    }

    const versions = satisfied.map(pkg => pkg.version);
    const maxVersion = semver.maxSatisfying(versions, versionSpec);

    return satisfied.find(pkg => pkg.version === maxVersion);
  }
}

module.exports = DependencyCache;
