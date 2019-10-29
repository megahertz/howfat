#!/usr/bin/env node

'use strict';

const { createProgressIndicator } = require('./utils');
const { createDependencyFactory } = require('./dependency');
const { createDependencyResolver } = require('./resolver');
const { createReporter } = require('./reporters');
const { createHttpClient, getConfig } = require('./utils');

const config = getConfig();

main().catch((error) => {
  console.error('Error:', config.isVerbose ? error : error.message);
  process.exit(1);
});

async function main() {
  const httpClient = createHttpClient({
    connectionLimit: config.connectionLimit,
    timeout: config.timeout,
    retryCount: config.retryCount,
  });
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
  } else {
    rootDependency = dependencyFactory.createGroup(config.fetchedPackages);
  }

  const resolver = createDependencyResolver(
    httpClient,
    config.dependencyTypeFilter,
    dependencyFactory
  );
  rootDependency = await resolver.resolve(rootDependency);
  progressIndicator.finish();

  createReporter(config.reporter).print(rootDependency);

  process.exit();
}
