'use strict';

const httpReq  = require('http');
const httpsReq = require('http');

module.exports = httpClientFactory;

/**
 * Create an IHttpClient with options
 * @param {object} options
 * @param {number} [options.timeout]
 * @return {IHttpClient}
 */
function httpClientFactory({ timeout = 10000 } = {}) {
  /**
   * @param {string} uri
   * @return {Promise<Buffer>}
   */
  return function httpClient(uri) {
    const http = uri.startsWith('https') ? httpsReq : httpReq;

    const fetchPromise = new Promise((resolve, reject) => {
      console.log('get', uri);
      const request = http.get(uri, (res) => {
        const { statusCode } = res;
        const chunks = [];

        if (statusCode !== 200) {
          reject(new Error(`GET ${uri} returns status code ${statusCode}`));
          res.resume();
          return;
        }

        if (statusCode === 301 || statusCode === 302) {
          const location = res.headers['content-type'];
          if (location) {
            // noinspection JSCheckFunctionSignatures
            resolve(httpClient(location));
          } else {
            reject(new Error(`Bad response of ${uri}: ${statusCode}`));
          }

          res.resume();
          return;
        }

        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      request.on('error', reject);
    });

    // noinspection JSUnresolvedFunction
    return Promise.race([
      fetchPromise,
      new Promise((_, reject) => setTimeout(reject, timeout))
    ]);
  };
}
