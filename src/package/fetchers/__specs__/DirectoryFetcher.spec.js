'use strict';

const { describe, expect, it } = require('humile');
const path = require('path');
const { loadProject, printDependencyGraph } = require('../../../__specs__');

describe('DirectoryFetcher', () => {
  describe('should resolve local dependencies correctly', () => {
    it('should return 0 dependencies for itself', async () => {
      const graph = await loadProject('local-dependencies');
      printDependencyGraph(graph.getRoot());
      const project = graph.getFixtureRoot();
      const firstLocal = graph.getNode(['first-local']);

      expect(firstLocal.name).toBe('first-local');
      expect(firstLocal.spec.versionSpec)
        .toBe(path.join(project.spec.versionSpec, '/packages/first-local'));
    });
  });
});
