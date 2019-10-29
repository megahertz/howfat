'use strict';

const StatProgressIndicator = require('./StatProgressIndicator');
const UrlProgressIndicator = require('./UrlProgressIndicator');
const ProgressIndicator = require('./UrlProgressIndicator');

module.exports = {
  createProgressIndicator,
};

/**
 *
 * @param {HttpClient} httpClient
 * @param {ProgressIndicatorType} type
 * @param {NodeJS.WriteStream} stream
 * @return {ProgressIndicator}
 */
function createProgressIndicator(
  httpClient,
  type = 'stat',
  stream = process.stderr
) {
  switch (type) {
    case 'stat': return new StatProgressIndicator(httpClient, stream);
    case 'url': return new UrlProgressIndicator(httpClient, stream);
    default: return new ProgressIndicator(httpClient, stream);
  }
}
