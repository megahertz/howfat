'use strict';

const { describe, expect, it } = require('humile');

const getPackageMeta = require('..');

describe('Meta', () => {
  it('should calculate stats recursively', () => {
    const { meta, a, b } = createMeta();

    expect(a.getStats()).toEqual({
      fileCount: 110,
      unpackedSize: 1100,
      depCount: 1,
    });

    expect(b.getStats()).toEqual({
      fileCount: 100,
      unpackedSize: 1000,
      depCount: 0,
    });

    expect(meta.getStats()).toEqual({
      fileCount: 111,
      unpackedSize: 1110,
      depCount: 2,
    });
  });

  it('should return children dependencies as array', () => {
    const { meta, a } = createMeta();

    expect(meta.getDependenciesAsArray()).toEqual([a]);
  });
});

function createMeta() {
  const meta = getPackageMeta('test');
  const a = getPackageMeta('a');
  const b = getPackageMeta('b');

  meta.dependencies = { a };
  meta.dependencies.a.dependencies = { b };

  meta.fileCount = 1;
  meta.unpackedSize = 10;
  a.fileCount = 10;
  a.unpackedSize = 100;
  b.fileCount = 100;
  b.unpackedSize = 1000;

  return { meta, a, b };
}
