'use strict';

const tar = require('tar');

class TarballStat {
  constructor() {
    this.fileCount = 0;
    this.unpackedSize = 0;
    this.packageJson = {};
  }
}

module.exports = {
  statsFromStream,
  TarballStat,
};

/**
 * Read gzipped tar package stream and return its stats
 * @param {module:stream.internal.Readable} stream
 * @returns {Promise<TarballStat>}
 */
function statsFromStream(stream) {
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
