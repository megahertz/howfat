'use strict';

const fs = require('fs');
const path = require('path');
const { createDependencyFactory } = require('../dependency');
const PackageFactory = require('../package/PackageFactory');
const Tree = require('../reporters/Tree');
const { createDependencyResolver } = require('../resolver');
const HttpClient = require('../utils/http/HttpClient');
const TarballReader = require('../utils/tarball/TarballReader');

const dependencyFactory = createDependencyFactory();
const packageFactory = new PackageFactory({
  httpClient: null,
  tarballReader: null,
});
const fixtureCache = {};

// noinspection JSUnusedGlobalSymbols
module.exports = {
  createDependency,
  createSimpleGraph,
  dependencyFactory,
  getFixtureName,
  loadProject,
  loadFixture,
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
    dependency.spec,
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
 * Create dependencies graph from the fixture (cached version)
 * @param {string} packageName
 * @return {Promise<FixtureGraph>}
 */
async function loadFixture(packageName) {
  if (fixtureCache[packageName]) {
    return fixtureCache[packageName];
  }

  const fixture = await loadFixtureWithoutCache(packageName);
  fixtureCache[packageName] = fixture;
  return fixture;
}

/**
 * Create dependencies graph from the fixture
 * @param {string} packageName
 * @return {Promise<FixtureGraph>}
 */
async function loadFixtureWithoutCache(packageName) {
  const resolver = createDependencyResolver(
    createMockedPackageFactory(),
    dependencyFactory,
  );

  const root = dependencyFactory.createGroup([packageName]);
  return new FixtureGraph(await resolver.resolve(root));
}

/**
 * Create dependencies graph from the test project
 * @param {string} projectName
 * @return {Promise<FixtureGraph>}
 */
async function loadProject(projectName) {
  const resolver = createDependencyResolver(
    createMockedPackageFactory(),
    dependencyFactory,
  );

  const root = dependencyFactory.createProject(
    path.resolve(__dirname, 'projects', projectName),
  );
  return new FixtureGraph(await resolver.resolve(root));
}

/**
 * @param {Dependency} dependency
 */
function printDependencyGraph(dependency) {
  // eslint-disable-next-line no-console
  const reporter = new Tree({ printer: console.info });
  reporter.print(dependency);
}

class HttpClientMock extends HttpClient {
  constructor() {
    super({});
  }

  async request(config) {
    const { url } = config;

    return {
      data: this.getFixtureFromUrl(url),
      headers: {},
      status: 200,
    };
  }

  async getFixtureFromUrl(url) {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      getFixtureName(path.basename(url)) + '.json',
    );

    return fs.promises.readFile(fixturePath, 'utf8').then(JSON.parse);
  }
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
      node = node && node.children.find((dep) => dep.name === nodeName);
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
    if (this.getRoot().isReal()) {
      return this.getRoot();
    }

    return this.getRoot().children[0];
  }
}

function createMockedPackageFactory() {
  const httpClient = new HttpClientMock();
  const tarballReader = new TarballReader({ httpClient });

  tarballReader.readStream = (stream) => stream;

  return new PackageFactory({ httpClient, tarballReader });
}
