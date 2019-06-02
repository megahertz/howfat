'use strict';

const httpReq  = require('http');
const httpsReq = require('http');

module.exports = downloaderFactory;

/**
 * @callback IDownloader
 * @param {string} url
 * @return Promise<string>
 */

/**
 * Create an IDownloader with options
 * @param {object} options
 * @param {number} [options.timeout]
 * @param {boolean} [options.debug]
 * @return {IDownloader}
 */
function downloaderFactory({ timeout = 10000, debug } = {}) {
  /**
   * @param {string} uri
   * @return {Promise<string>}
   */
  return function downloader(uri) {
    const http = uri.startsWith('https') ? httpsReq : httpReq;

    const fetchPromise = new Promise((resolve, reject) => {
      if (debug) {
        console.debug('get', uri);
      }

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
            resolve(downloader(location));
          } else {
            reject(new Error(`Bad response of ${uri}: ${statusCode}`));
          }

          res.resume();
          return;
        }

        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

      request.on('error', reject);
    });

    return Promise.race([
      fetchPromise,
      new Promise((_, reject) => setTimeout(reject, timeout)),
    ]);
  };
}
