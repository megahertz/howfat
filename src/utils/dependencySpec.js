'use strict';

const npa = require('npm-package-arg');
const semver = require('semver');

module.exports = {
  filterReleases,
  getLatestVersion,
  isRightPlatform,
  parseSpec,
};

/**
 * @param {string[]} availableVersions
 * @return {string[]}
 */
function filterReleases(availableVersions) {
  return availableVersions.filter(v => !semver.prerelease(v));
}

/**
 * @param {string[]} availableVersions
 * @param {string} versionSpec
 * @return {string}
 */
function getLatestVersion(availableVersions, versionSpec) {
  return semver.maxSatisfying(availableVersions, versionSpec);
}

/**
 * @param {{ platform?: string[], arch?: string[] }} platformSpec
 * @param {{ platform: string, arch: string }} actual
 * @return {boolean}
 */
function isRightPlatform(platformSpec, actual = process) {
  return isValueMatchList(actual.platform, platformSpec.platform)
    && isValueMatchList(actual.arch, platformSpec.arch);
}

/**
 * @param {string} value
 * @param {string[]}list
 * @return {boolean}
 */
function isValueMatchList(value, list) {
  let match = false;
  let negotiationCount = 0;

  if (!list) {
    return true;
  }

  list = Array.isArray(list) ? list : [list];

  if (list.length === 1 && list[0] === 'any') {
    return true;
  }

  for (let item of list) {
    if (item[0] === '!') {
      item = item.slice(1);
      if (item === value) {
        return false;
      }

      negotiationCount++;
    } else {
      match = match || item === value;
    }
  }

  return match || negotiationCount === list.length;
}

/**
 *
 * @param {string} name
 * @param {string} versionSpec
 * @param {string} localPath
 * @return {DependencySpec}
 */
function parseSpec(name, versionSpec = undefined, localPath = undefined) {
  let meta;
  if (versionSpec) {
    meta = npa.resolve(name, versionSpec, localPath);
  } else {
    meta = npa(name, localPath);
  }

  let source = 'npm';
  if (meta.type === 'directory') {
    source = 'directory';
  }

  return {
    escapedName: meta.escapedName,
    name: meta.name,
    source,
    versionSpec: meta.fetchSpec,
  };
}
