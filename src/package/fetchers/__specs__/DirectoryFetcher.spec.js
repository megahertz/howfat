'use strict';

const { describe, expect, it } = require('humile');
const path = require('path');
const { loadProject } = require('../../../__specs__');

describe('DirectoryFetcher', () => {
  it('should resolve local dependencies correctly', async () => {
    const graph = await loadProject('local-dependencies');

    const project = graph.getFixtureRoot();
    const firstLocal = graph.getNode(['local1']);

    expect(firstLocal.name).toBe('local1');
    expect(firstLocal.spec.versionSpec)
      .toBe(path.join(project.spec.versionSpec, '../local1'));

    expect(project.getStatsRecursive()).toEqual({
      dependencyCount: 2,
      fileCount: 6,
      unpackedSize: 429,
    });
  });
});
