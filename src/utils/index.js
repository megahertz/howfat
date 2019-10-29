'use strict';

const { getConfig } = require('./config');
const { get } = require('./http/http');
const HttpClient = require('./http/HttpClient');
const { createProgressIndicator } = require('./http/progress');
const { statsFromStream } = require('./tarball');

module.exports = {
  createHttpClient,
  createProgressIndicator,
  getConfig,
  getTarballStats,
};

/**
 * @param {object} [options]
 * @param {number} [options.connectionLimit]
 * @param {number} [options.timeout]
 * @param {number} [options.retryCount]
 * @return {HttpClient}
 */
function createHttpClient(options = {}) {
  return new HttpClient(get, options);
}

/**
 * @param {string} url
 * @param {HttpClient} httpClient
 * @return {Promise<TarballStat>}
 */
function getTarballStats(url, httpClient) {
  return httpClient.getUsingTransformer(url, (response) => {
    return statsFromStream(response.stream);
  });
}
