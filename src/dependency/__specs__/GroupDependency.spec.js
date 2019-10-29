'use strict';

const { describe, expect, it } = require('humile');
const { dependencyFactory, loadFixture } = require('../../__specs__');

describe('GroupDependency', () => {
  describe('getStatsRecursive', () => {
    it('should return 0 dependencies for itself', () => {
      const root = dependencyFactory.createGroup();

      expect(root.getStatsRecursive()).toEqual({
        dependencyCount: 0,
        fileCount: 0,
        unpackedSize: 0,
      });
    });

    it('should not count direct descendants', () => {
      const root = dependencyFactory.createGroup();
      const a = dependencyFactory.create('a');
      const b = dependencyFactory.create('b');
      root.addDependency(a);
      root.addDependency(b);

      expect(root.getStatsRecursive()).toEqual({
        dependencyCount: 0,
        fileCount: 0,
        unpackedSize: 0,
      });
    });

    it('should count only indirect descendants', () => {
      const root = dependencyFactory.createGroup();
      const a = dependencyFactory.create('a');
      const b = dependencyFactory.create('b');
      root.addDependency(a);
      a.children.push(b);

      expect(root.getStatsRecursive()).toEqual({
        dependencyCount: 1,
        fileCount: 0,
        unpackedSize: 0,
      });
    });

    it('should return stats for a complex graph correctly', async () => {
      const graph = await loadFixture('@webassemblyjs/helper-code-frame');
      expect(graph.getRoot().getStatsRecursive()).toEqual({
        dependencyCount: 10,
        unpackedSize: 691071,
        fileCount: 96,
      });
    });
  });
});
