'use strict';

const Downloader        = require('./Downloader');
const httpClientFactory = require('./httpClientFactory');

module.exports = download;

/**
 * @param {IDownloadItem[]} items
 * @param {ITransformer} transformer
 * @param {Partial<IDownloaderOptions<object>>} [options]
 */
function download(items, transformer, options = {}) {
  const downloader = new Downloader({
    httpClient: httpClientFactory(),
    items,
    transformer,
    initialResults: null,
    ...options,
  });
  return downloader.start();
}
