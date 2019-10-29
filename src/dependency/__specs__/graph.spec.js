'use strict';

const { describe, expect, it } = require('humile');
const { createSimpleGraph, dependencyFactory } = require('../../__specs__');
const DuplicateDependency = require('../DuplicateDependency');
const graph = require('../graph');

describe('graph', () => {
  it('flat', () => {
    const { root, a, b } = createSimpleGraph();

    expect(graph.flat(root)).toEqual(new Set([a, b]));
  });

  it('mapAsync', async () => {
    let { root } = createSimpleGraph();

    root = await graph.mapAsync(root, async (dep) => {
      if (dep.spec.name === 'test') {
        return dep;
      }

      return dependencyFactory.createDuplicate(dep);
    });

    expect(root.children[0].constructor).toBe(DuplicateDependency);
    expect(root.children[0].getOriginal().children[0].constructor)
      .toBe(DuplicateDependency);
  });
});
