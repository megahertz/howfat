'use strict';

const download       = require('./downloader');
const getPackageMeta = require('./getPackageMeta');

module.exports = {
  getDepsGraph,
};

/**
 * Return metadata of the package
 * @param {string} name
 * @param {string} [version]
 * @param {IMetaOptions} [options]
 * @return {Promise<Meta>}
 */
async function getDepsGraph(name, version, options) {
  const item = getPackageMeta(name, version, options);
  return download([item], transformer);
}

/**
 * @param {Buffer} content
 * @param {any[]} results
 * @param {Downloader} downloader
 * @param {IDownloadItem & Meta} item
 * @return {Promise<any[]>}
 */
function transformer(content, results, downloader, item) {
  const json = JSON.parse(content.toString('utf8'));

  item.addPackageInformation(json);
  item.getDependenciesAsArray().forEach(dep => downloader.add(dep));

  return Promise.resolve(results || item);
}
