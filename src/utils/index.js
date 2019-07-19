'use strict';

const { get }             = require('./http');
const { statsFromStream } = require('./tarball');

module.exports = {
  makeGetPkgMeta,
  makeGetPkgStat,
};

/**
 * @param {number} timeout
 * @return {IGetPkgMeta}
 */
function makeGetPkgMeta({ timeout = 5000 } = {}) {
  return (url) => {
    return get(url, { timeout }).asJson();
  };
}

/**
 * @param {number} timeout
 * @return {IGetPkgStat}
 */
function makeGetPkgStat({ timeout = 5000 } = {}) {
  return (url) => {
    return statsFromStream(get(url, { timeout }).stream);
  };
}
