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
    !this.isDisabled() && this.onFinish();
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
   * @param {HttpTask} task
   * @protected
   */
  onStartDownloading(task) {
  }

  /**
   * @param {HttpProgressEvent} progress
   * @protected
   */
  onProgress(progress) {
  }

  /**
   * @protected
   */
  onFinish() {
  }
}

module.exports = ProgressIndicator;
