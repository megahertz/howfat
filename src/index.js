#!/usr/bin/env node

'use strict';

const { createDependencyFactory } = require('./dependency');
const { createPackageFactory } = require('./package');
const { createReporter } = require('./reporters');
const { createDependencyResolver } = require('./resolver');
const {
  createHttpClient,
  createProgressIndicator,
  getConfig,
} = require('./utils');

const config = getConfig();

main().catch((error) => {
  console.error('Error:', config.isVerbose ? error : error.message);
  process.exit(1);
});

async function main() {
  const httpClient = createHttpClient(config.httpOptions);
  httpClient.on('error', (task) => {
    console.error('Warning:', task.lastError.message);
  });

  const dependencyFactory = createDependencyFactory();
  const progressIndicator = createProgressIndicator(
    httpClient,
    config.isVerbose ? 'url' : 'stat'
  );

  let rootDependency;
  if (config.projectPath) {
    rootDependency = dependencyFactory.createProject(config.projectPath);
  } else if (config.fetchedPackages.length > 0) {
    rootDependency = dependencyFactory.createGroup(config.fetchedPackages);
  } else {
    console.error(config.helpText);
    process.exit(1);
  }

  const resolver = createDependencyResolver(
    createPackageFactory(httpClient),
    dependencyFactory,
    config.dependencyTypeFilter
  );
  rootDependency = await resolver.resolve(rootDependency);
  progressIndicator.finish();

  createReporter(config.reporterOptions).print(rootDependency);

  process.exit();
}
