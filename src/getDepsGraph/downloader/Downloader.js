'use strict';

const { EventEmitter } = require('events');

/**
 * @template T
 */
class Downloader extends EventEmitter {
  /**
   * @param {IDownloaderOptions<T>} options
   */
  constructor(options) {
    super();

    /** @type {IDownloaderOptions<T>} */
    this.options = {
      asyncLimit: 5,
      initialResults: [],
      stopOnError: true,
      ...options,
    };

    /** @type {IDownloadItem[]} */
    this.queue = [];

    /** @type {T} */
    this.results = this.options.initialResults;

    /** @type {Array<Promise<Buffer>>} */
    this.threads = [];

    this.startPromiseCallbacks = {
      reject: () => {},
      resolve: () => {},
    };

    this.add     = this.add.bind(this);
    this.next    = this.next.bind(this);
    this.onError = this.onError.bind(this);
    this.stop    = this.stop.bind(this);
  }

  /**
   * @param {IDownloadItem} item
   * @fires add(item: IDownloadItem)
   */
  add(item) {
    this.emit('add', item);
    this.queue.push(item);
    this.next();
  }

  /**
   * Process download list and return result
   * @return {Promise<T>}
   */
  start() {
    return new Promise((resolve, reject) => {
      this.startPromiseCallbacks = { reject, resolve };
      this.options.items.forEach(item => this.add(item));
    });
  }

  stop() {
    this.queue = [];
    this.threads = [];
  }

  /**
   * @private
   */
  next() {
    if (this.queue.length < 1) {
      return this.threads[0];
    }

    if (this.threads.length > this.options.asyncLimit) {
      return this.threads[0];
    }

    const item = this.queue.shift();
    if (!item) {
      return this.threads[0];
    }

    if (this.options.debug) {
      console.debug('GET', item.url);
    }

    const downloadPromise = this.options.httpClient(item.url);
    this.threads.push(downloadPromise);

    downloadPromise
      .then((buffer) => {
        if (!this.options.transformer) {
          this.results.push(buffer);
          return this.results;
        }

        return this.options.transformer(buffer, this.results, this, item);
      })
      .then((results) => {
        this.results = results;
        this.threads = this.threads.filter(t => t !== downloadPromise);
        this.onItemComplete(item);
      })
      .catch((e) => {
        this.threads = this.threads.filter(t => t !== downloadPromise);
        this.onError(e);
      });
  }

  /**
   * @param {Error} e
   * @fires error(e: Error)
   * @private
   */
  onError(e) {
    if (this.listenerCount('error') > 0) {
      this.emit('error', e);
    }

    if (this.options.stopOnError) {
      this.stop();
      this.startPromiseCallbacks.reject(e);
    }
  }

  /**
   * @param {IDownloadItem} item
   * @fires item-complete(item: IDownloadItem, results: T)
   * @fires complete(results: T)
   * @private
   */
  onItemComplete(item) {
    this.emit('item-complete', item, this.results);

    if (this.queue.length < 1 && this.threads.length < 1) {
      this.emit('complete', this.results);
      this.startPromiseCallbacks.resolve(this.results);
    }

    process.nextTick(this.next);
  }
}

module.exports = Downloader;
