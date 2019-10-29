'use strict';

class HttpTask {
  /**
   * @param {() => Promise} start
   * @param {string} url
   * @param {function} resolve
   * @param {function} reject
   */
  constructor(start, url, resolve, reject) {
    this.startFunction  = start;

    this.url     = url;
    this.resolve = resolve;
    this.reject  = reject;

    this.retries = 0;
    this.lastError = null;

    /** @type { 'pending' | 'rejected' | 'resolved' } */
    this.status = 'pending';
    this.response = null;
  }

  addError(error) {
    this.retries++;
    this.lastError = error;
  }

  setResolved(response) {
    this.status = 'resolved';
    this.response = response;
    this.resolve(response);
  }

  setRejected() {
    this.status = 'rejected';
    this.reject(this.lastError);
  }

  start() {
    if (!this.promise) {
      this.promise = this.startFunction();
    }

    return this.promise;
  }
}

module.exports = HttpTask;
