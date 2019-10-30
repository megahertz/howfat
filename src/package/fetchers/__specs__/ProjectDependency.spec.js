'use strict';

const { describe, expect, it } = require('humile');
const { loadProject } = require('../../../__specs__');

describe('DirectoryFetcher', () => {
  describe('should resolve local dependencies correctly', () => {
    it('should return 0 dependencies for itself', async () => {
      const graph = await loadProject('local-dependencies');

      const firstLocal = graph.getNode(['first-local']);

      expect(firstLocal.name).toBe('first-local');
    });
  });
});
