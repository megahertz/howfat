'use strict';

class ProgressIndicator {
  /**
   * @param {HttpClient} httpClient
   * @param {NodeJS.WriteStream} stream
   */
  constructor(httpClient, stream = process.stderr) {
    this.httpClient = httpClient;
    this.stream = stream;

    if (!this.isDisabled()) {
      this.httpClient.on('start', this.onStartDownloading.bind(this));
      this.httpClient.on('progress', this.onProgress.bind(this));
    }

    this.onInit();
  }

  /**
   * @final
   */
  finish() {
    if (!this.isDisabled()) {
      this.onFinish();
    }
  }

  isDisabled() {
    return false;
  }

  /**
   * @protected
   */
  onInit() {
  }

  /**
   * @param {HttpTask} _task
   * @protected
   */
  onStartDownloading(_task) {
  }

  /**
   * @param {HttpProgressEvent} _progress
   * @protected
   */
  onProgress(_progress) {
  }

  /**
   * @protected
   */
  onFinish() {
  }
}

module.exports = ProgressIndicator;
