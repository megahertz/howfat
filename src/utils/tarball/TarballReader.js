'use strict';

const tar = require('tar');
const TarballStat = require('./TarballStat');

class TarballReader {
  /** @type {HttpClient} */
  #httpClient;

  /**
   * @param {object} options
   * @param {HttpClient} options.httpClient
   */
  constructor({ httpClient }) {
    this.#httpClient = httpClient;
  }

  /**
   * Read gzipped tar package stream and return its stats
   * @param {module:stream.internal.Readable} stream
   * @returns {Promise<TarballStat>}
   */
  async readStream(stream) {
    return new Promise((resolve, reject) => {
      const stat = new TarballStat();

      const tarStream = stream.pipe(tar.t());

      tarStream.on('entry', (entry) => {
        stat.fileCount += 1;
        stat.unpackedSize += entry.size;

        if (entry.path.match(/^[^/]+\/package.json$/)) {
          const chunks = [];
          entry.on('data', (chunk) => chunks.push(chunk));
          entry.on('error', reject);
          entry.on('end', () => {
            try {
              const content = Buffer.concat(chunks).toString('utf8');
              stat.packageJson = JSON.parse(content);
            } catch (e) {
              reject(e);
            }
          });
        }
      });

      tarStream.on('end', () => resolve(stat));
      tarStream.on('error', reject);
    });
  }

  /**
   * Read url tarball and return its stats
   * @param {string} url
   * @returns {Promise<TarballStat>}
   */
  async readUrl(url) {
    const stream = await this.#httpClient.getStream(url);
    return this.readStream(stream);
  }
}

module.exports = TarballReader;
