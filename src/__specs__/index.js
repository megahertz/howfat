'use strict';

const fs                           = require('fs');
const path                         = require('path');
const { createDependencyFactory }  = require('../dependency');
const { createPackageFactory }     = require('../package');
const Tree                         = require('../reporters/Tree');
const { createDependencyResolver } = require('../resolver');

const dependencyFactory = createDependencyFactory();
const packageFactory = createPackageFactory(null);
const fixtureCache = {};

module.exports = {
  createDependency,
  createSimpleGraph,
  dependencyFactory,
  getFixtureName,
  loadFixture,
  loadFixtureWithoutCache,
  printDependencyGraph,
};

/**
 * @param {string} name
 * @param {string} versionSpec
 * @param {(string | null)} version
 * @return {Dependency}
 */
function createDependency(name, versionSpec, { version = null } = {}) {
  const dependency = dependencyFactory.create(name, versionSpec);
  dependency.package = packageFactory.createUnresolved(
    dependency.spec
  );
  dependency.package.version = version || versionSpec;
  return dependency;
}

/**
 * @return {{ root: Dependency, a: Dependency, b: Dependency }}
 */
function createSimpleGraph() {
  const root = createDependency('test', '1.0.0');
  const a = createDependency('a', '1.0.0');
  const b = createDependency('b', '1.0.0');

  root.package.stats = { fileCount: 1, unpackedSize: 10 };
  root.children.push(a);

  a.package.stats = { fileCount: 10, unpackedSize: 100 };
  a.children.push(b);

  b.package.stats = { fileCount: 100, unpackedSize: 1000 };

  return { root, a, b };
}

/**
 * Transform package name to fixture name
 * @param {string} packageName
 * @return {string}
 */
function getFixtureName(packageName) {
  return decodeURIComponent(packageName)
    .replace('@', '')
    .replace('/', '_');
}

/**
 * Create dependencies graph from the fixture
 * @param {string} packageName
 * @return {Promise<FixtureGraph>}
 */
async function loadFixture(packageName) {
  if (fixtureCache[packageName]) {
    return fixtureCache[packageName];
  }

  return loadFixtureWithoutCache(packageName);
}

/**
 * Create dependencies graph from the fixture
 * @param {string} packageName
 * @return {Promise<FixtureGraph>}
 */
async function loadFixtureWithoutCache(packageName) {
  const root = dependencyFactory.createGroup();
  root.addDependency(dependencyFactory.create(packageName));

  const fixtureName = getFixtureName(packageName);
  const httpClient = {
    getJson: getFixtureFromUrl,
    getUsingTransformer: getFixtureFromUrl,
  };
  const resolver = createDependencyResolver(httpClient, {}, dependencyFactory);

  const result = new FixtureGraph(await resolver.resolve(root));
  fixtureCache[packageName] = result;

  return result;

  function getFixtureFromUrl(url) {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      fixtureName,
      getFixtureName(path.basename(url)) + '.json'
    );

    return fs.promises.readFile(fixturePath, 'utf8').then(JSON.parse);
  }
}

/**
 * @param {Dependency} dependency
 */
function printDependencyGraph(dependency) {
  const reporter = new Tree({ isVerbose: true, printer: console.log });
  reporter.print(dependency);
}

class FixtureGraph {
  constructor(root) {
    this.root = root;
  }

  /**
   *
   * @param {string[]} paths
   * @return {Dependency}
   */
  getNode(paths) {
    let node = this.getFixtureRoot();

    paths.forEach((nodeName) => {
      node = node && node.children.find(dep => dep.name === nodeName);
    });

    return node;
  }

  /**
   * @return {Dependency}
   */
  getRoot() {
    return this.root;
  }

  /**
   * @return {Dependency}
   */
  getFixtureRoot() {
    return this.root.children[0];
  }
}
