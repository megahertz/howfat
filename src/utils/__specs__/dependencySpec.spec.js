'use strict';

const { describe, expect, jasmine, it } = require('humile');
const dependencySpec = require('../dependencySpec');

describe('utils/dependencySpec', () => {
  it('filterReleases', () => {
    const versions = [
      '1.0.0',
      '0.2.3',
      '1.2.3-beta',
    ];

    expect(dependencySpec.filterReleases(versions)).toEqual([
      '1.0.0',
      '0.2.3',
    ]);
  });

  it('getLatestVersion', () => {
    const versions = [
      '1.0.2',
      '0.2.3',
      '1.2.3-beta',
    ];

    expect(dependencySpec.getLatestVersion(versions, '^1.0.0'))
      .toEqual('1.0.2');
  });

  describe('isRightPlatform', () => {
    it('should return true if in list', () => {
      const spec = { platform: ['linux'] };
      const actual = { platform: 'linux', arch: 'x64' };

      expect(dependencySpec.isRightPlatform(spec, actual)).toBe(true);
    });

    it('should return true if not in exceptions', () => {
      const spec = { platform: ['!win32'] };
      const actual = { platform: 'linux', arch: 'x64' };

      expect(dependencySpec.isRightPlatform(spec, actual)).toBe(true);
    });

    it('should return false if not in list', () => {
      const spec = { platform: ['linux'] };
      const actual = { platform: 'win32', arch: 'x64' };

      expect(dependencySpec.isRightPlatform(spec, actual)).toBe(false);
    });

    it('should return false if in exceptions', () => {
      const spec = { platform: ['!linux'] };
      const actual = { platform: 'linux', arch: 'x64' };

      expect(dependencySpec.isRightPlatform(spec, actual)).toBe(false);
    });
  });

  describe('parseSpec', () => {
    it('should parse directory dependency', () => {
      expect(dependencySpec.parseSpec('test', '..')).toEqual({
        escapedName: 'test',
        name: 'test',
        source: 'directory',
        versionSpec: jasmine.anything(),
      });
    });

    it('should parse NPM dependency', () => {
      expect(dependencySpec.parseSpec('test', '^1.0.0')).toEqual({
        escapedName: 'test',
        name: 'test',
        source: 'npm',
        versionSpec: '^1.0.0',
      });
    });
  });
});