'use strict';

const Downloader        = require('./Downloader');
const httpClientFactory = require('./httpClientFactory');

module.exports = download;

/**
 * @param {IDownloadItem[]} items
 * @param {ITransformer} transformer
 */
function download(items, transformer) {
  /**
   * @type {IDownloaderOptions<object>}}
   */
  const options = {
    httpClient: httpClientFactory(),
    items,
    transformer,
    initialResults: null,
  };

  const downloader = new Downloader(options);
  return downloader.start();
}
