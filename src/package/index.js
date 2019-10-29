'use strict';

const PackageFactory = require('./PackageFactory');
const { getTarballStats } = require('../utils');

module.exports = {
  createPackageFactory,
};

/**
 * @param {HttpClient} httpClient
 * @return {PackageFactory}
 */
function createPackageFactory(httpClient) {
  return new PackageFactory(httpClient, getTarballStats);
}
