#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

const { createDependencyFactory } = require('./dependency');
const { createReporter } = require('./reporters');
const { createDependencyResolver } = require('./resolver');
const { createProgressIndicator, getConfig } = require('./utils');
const TarballReader = require('./utils/tarball/TarballReader');
const PackageFactory = require('./package/PackageFactory');
const HttpClient = require('./utils/http/HttpClient');

const config = getConfig();

main().catch((error) => {
  console.error('Error:', config.isVerbose ? error : error.message);
  process.exit(1);
});

async function main() {
  const {
    dependencyFactory,
    progressIndicator,
    reporter,
    resolver,
  } = createModules();

  let rootDependency;
  if (config.projectPath) {
    rootDependency = dependencyFactory.createProject(config.projectPath);
  } else if (config.fetchedPackages.length > 0) {
    rootDependency = dependencyFactory.createGroup(config.fetchedPackages);
  } else {
    console.error(config.helpText);
    process.exit(1);
  }

  rootDependency = await resolver.resolve(rootDependency);
  progressIndicator.finish();

  reporter.print(rootDependency);
  process.exit();
}

function createModules() {
  const httpClient = new HttpClient(config.httpOptions);
  httpClient.on('error', ({ error, url }) => {
    console.error('Warning:', error.message, 'for', url);
  });

  const dependencyFactory = createDependencyFactory();
  const progressIndicator = createProgressIndicator(
    httpClient,
    config.isVerbose ? 'url' : 'stat',
  );

  const tarballReader = new TarballReader({ httpClient });

  const resolver = createDependencyResolver(
    new PackageFactory({
      httpClient,
      registryUrl: config.registryUrl,
      tarballReader,
    }),
    dependencyFactory,
    config.dependencyTypeFilter,
  );

  return {
    dependencyFactory,
    httpClient,
    progressIndicator,
    reporter: createReporter(config.reporterOptions),
    resolver,
  };
}
