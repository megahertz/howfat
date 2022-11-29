'use strict';

const HttpFetcher = require('./HttpFetcher');

class GithubFetcher extends HttpFetcher {
  /**
   * @param {Package} pkg
   * @param {DependencySpec} dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(pkg, { escapedName, versionSpec }) {
    const stats = await this.tarballReader.readUrl(
      `https://codeload.github.com/${escapedName}/tar.gz/${versionSpec}`,
    );

    this.updatePackageByStats(pkg, stats);

    return pkg;
  }
}

module.exports = GithubFetcher;
