#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { createHttpClient } = require('../../utils');
const { createDependencyResolver } = require('../../resolver');
const { createDependencyFactory } = require('../../dependency');
const { getFixtureName } = require('..');

main(process.argv).catch(console.error);

function createFixture(packageName, dirName = null) {
  const factory = createDependencyFactory();
  const httpClient = createHttpClient();
  const resolver = createDependencyResolver(httpClient, {}, factory);


  const destinationPath = prepareDestinationPath(packageName, dirName);
  httpClient
    .on('finish', serializeTaskResponse)
    .on('start', task => console.log('get', task.url));

  return resolver.resolve(factory.createGroup([packageName]));

  function serializeTaskResponse(task) {
    if (task.status !== 'resolved') return;

    const fixtureName = getFixtureName(path.basename(task.url));
    fs.writeFileSync(
      path.resolve(destinationPath, fixtureName + '.json'),
      JSON.stringify(task.response)
    );
  }
}

function prepareDestinationPath(packageName, dirName) {
  if (!dirName) {
    dirName = getFixtureName(packageName);
  }

  const destDir = path.join(__dirname, dirName);
  try {
    fs.mkdirSync(destDir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }

  return destDir;
}

async function main(argv) {
  if (argv.length < 3) {
    console.info('Usage: node createFixture.js PACKAGE[@version] [DIRNAME]');
    return;
  }

  await createFixture(argv[2], argv[3]);
  process.exit(0);
}
