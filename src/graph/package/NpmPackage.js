'use strict';

const semver       = require('semver');
const BasicPackage = require('./BasicPackage');

/**
 * Metadata for npm-hosted package
 * Some ideas from npm-remote-ls
 */
class NpmPackage extends BasicPackage {
  get url() {
    const registryUrl = this.options.registryUrl || 'http://registry.npmjs.org';
    return registryUrl + '/' + this.npaResult.escapedName;
  }

  /**
   * @param {*} packageJson
   * @param {IPackageFactory} packageFactory
   */
  addPackageInformation(packageJson, packageFactory) {
    const version = this.getVersion(packageJson);

    this.dependencies = this.transformDependencies(
      packageJson.versions[version].dependencies,
      packageFactory
    );

    if (this.options.fetchDevDependencies && !this.parent) {
      this.devDependencies = this.transformDependencies(
        packageJson.versions[version].devDependencies,
        packageFactory
      );
    }

    if (this.options.fetchPeerDependencies) {
      this.peerDependencies = this.transformDependencies(
        packageJson.versions[version].peerDependencies,
        packageFactory
      );
    }

    if (this.options.fetchOptionalDependencies) {
      this.optionalDependencies = this.transformDependencies(
        packageJson.versions[version].optionalDependencies,
        packageFactory
      );
    }

    const dist = packageJson.versions[version].dist;
    if (dist) {
      this.fileCount = dist.fileCount;
      this.unpackedSize = dist.unpackedSize;
    }

    this.version = version;
  }

  /**
   * Return the exact package version
   * @param {any} packageJson
   * @param {any} packageJson.versions
   * @param {any} packageJson['dist-tags']
   */
  getVersion(packageJson) {
    let specVersion = this.npaResult.rawSpec || '*';
    if (specVersion === 'latest') {
      specVersion = '*';
    }

    const availableVersions = Object.keys(packageJson.versions);
    let version = semver.maxSatisfying(availableVersions, specVersion, true);
    if (version) {
      return version;
    }

    const isOnlyPrereleaseAvailable = availableVersions.every((av) => {
      return new semver.SemVer(av, true).prerelease.length > 0;
    });

    if (specVersion === '*' && isOnlyPrereleaseAvailable) {
      version = packageJson['dist-tags'] && packageJson['dist-tags'].latest;
    }

    if (version) {
      return version;
    }

    const pkg = this.npaResult.raw;
    throw Error('Could not find a satisfactory version for ' + pkg);
  }
}

module.exports = NpmPackage;
