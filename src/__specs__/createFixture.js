#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { createHttpClient } = require('../utils');
const { createDependencyResolver } = require('../resolver');
const { createDependencyFactory } = require('../dependency');
const { createPackageFactory } = require('../package');
const { getFixtureName } = require('.');

main(process.argv.slice(2)).catch(console.error);

function createFixture(packageName) {
  const factory = createDependencyFactory();
  const httpClient = createHttpClient();
  const resolver = createDependencyResolver(
    createPackageFactory(httpClient),
    factory
  );

  httpClient
    .on('finish', serializeTaskResponse)
    .on('start', (task) => console.error('get', task.url));

  return resolver.resolve(factory.createGroup([packageName]));
}

async function main([packageName]) {
  if (!packageName) {
    console.info('Usage: ./createFixture.js PACKAGE[@version]');
    return;
  }

  await createFixture(packageName);
  process.exit(0);
}

function serializeTaskResponse(task) {
  if (task.status !== 'resolved') return;

  const fixtureName = getFixtureName(path.basename(task.url));
  const jsonPath = path.resolve(__dirname, 'fixtures', fixtureName + '.json');

  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify(task.response));
  }
}
