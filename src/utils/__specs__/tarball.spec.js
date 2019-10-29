'use strict';

const { describe, expect, it } = require('humile');

const fs = require('fs');
const path = require('path');
const tarball = require('../tarball');

describe('tarball', () => {
  it('should load package information from tar gzip stream', async () => {
    const readStream = fs.createReadStream(
      path.join(__dirname, 'tarball.fixture.tgz')
    );
    const stats = await tarball.statsFromStream(readStream);

    expect(stats.fileCount).toBe(9);
    expect(stats.unpackedSize).toBe(15651);
    expect(stats.packageJson.name).toBe('electron-log');
  });
});
