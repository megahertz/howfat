'use strict';

const { describe, expect, expectAsync, it, jasmine } = require('humile');

const Downloader = require('../Downloader');

const RESOURCES = {
  a: { name: 'a', dependencies: ['b', 'c'] },
  b: { name: 'b', dependencies: ['c', 'd'] },
  c: { name: 'c', dependencies: [] },
  d: { name: 'd', dependencies: [] },
  e: { name: 'e', dependencies: ['a', 'b', 'c', 'd'] },
};

describe('Downloader', () => {
  it('should download a single resources', async () => {
    const downloader = createDownloader();

    const response = await downloader.start();

    expect(response).toEqual([
      { name: 'a', dependencies: ['b', 'c'] },
    ]);
  });

  it('should emit complete events', async () => {
    const downloader = createDownloader();

    const spies = {
      complete: jasmine.createSpy('complete'),
      itemComplete: jasmine.createSpy('itemComplete'),
    };

    downloader
      .on('complete', spies.complete)
      .on('item-complete', spies.itemComplete);

    await downloader.start();

    expect(spies.itemComplete).toHaveBeenCalledWith(
      { url: 'a' },
      jasmine.anything()
    );
    expect(spies.complete).toHaveBeenCalledWith([
      { name: 'a', dependencies: ['b', 'c'] },
    ]);
  });

  it('should download dependencies', async () => {
    const downloader = createDownloader({
      transformer,
    });

    const response = await downloader.start();

    expect(response).toEqual([
      { name: 'a', dependencies: ['b', 'c'] },
      { name: 'b', dependencies: ['c', 'd'] },
      { name: 'c', dependencies: [] },
      { name: 'c', dependencies: [] },
      { name: 'd', dependencies: [] },
    ]);
  });

  it('should use queue when downloading', async () => {
    const queuePromises = [];

    const downloader = createDownloader({
      items: [{ url: 'e' }],
      asyncLimit: 3,
      transformer,
      httpClient(url) {
        return new Promise((resolve) => {
          queuePromises.push(() => {
            resolve(RESOURCES[url]);
          });
        });
      },
    });

    const interval = setInterval(() => queuePromises.shift()(), 0);
    const response = await downloader.start();
    clearInterval(interval);

    expect(response).toEqual([
      { name: 'e', dependencies: ['a', 'b', 'c', 'd'] },
      { name: 'a', dependencies: ['b', 'c'] },
      { name: 'b', dependencies: ['c', 'd'] },
      { name: 'c', dependencies: [] },
      { name: 'd', dependencies: [] },
      { name: 'b', dependencies: ['c', 'd'] },
      { name: 'c', dependencies: [] },
      { name: 'c', dependencies: [] },
      { name: 'd', dependencies: [] },
      { name: 'c', dependencies: [] },
      { name: 'd', dependencies: [] },
    ]);
  });

  it('should handle errors', async () => {
    const downloader = createDownloader({
      // eslint-disable-next-line no-throw-literal
      transformer: () => { throw 'err' },
    });

    await expectAsync(downloader.start()).toBeRejectedWith('err');
  });
});

/**
 *
 * @param {Partial<IDownloaderOptions<object>>} options
 * @return {Downloader}
 */
function createDownloader(options = {}) {
  return new Downloader({
    items: [{ url: 'a' }],
    httpClient(url) {
      if (RESOURCES[url]) {
        return Promise.resolve(RESOURCES[url]);
      }

      return Promise.reject(new Error(url + ' not found'));
    },
    ...options,
  });
}

function transformer(content, results, downloader) {
  if (content.dependencies && content.dependencies.length > 0) {
    content.dependencies.forEach(dep => downloader.add({ url: dep }));
  }

  results.push(content);
  return results;
}
