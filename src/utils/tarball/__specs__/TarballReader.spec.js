'use strict';

const { describe, expect, it } = require('humile');

const fs = require('fs');
const path = require('path');
const TarballReader = require('../TarballReader');

describe('TarballReader', () => {
  describe('readStream', () => {
    it('should load package information from tar gzip stream', async () => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'tarball.fixture.tgz'),
      );
      const reader = new TarballReader({ httpClient: null });

      const stats = await reader.readStream(readStream);

      expect(stats.fileCount).toBe(9);
      expect(stats.unpackedSize).toBe(15651);
      expect(stats.packageJson.name).toBe('electron-log');
    });
  });
});
