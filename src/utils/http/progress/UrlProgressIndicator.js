'use strict';

const ProgressIndicator = require('./ProgressIndicator');

class UrlProgressIndicator extends ProgressIndicator {
  /**
   * @param {HttpTask} task
   */
  onStartDownloading(task) {
    this.stream.write('get ' + task.url + '\n');
  }
}

module.exports = UrlProgressIndicator;
