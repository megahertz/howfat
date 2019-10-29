'use strict';

const ProgressIndicator = require('./ProgressIndicator');

class StatProgressIndicator extends ProgressIndicator {
  isDisabled() {
    return !this.stream.isTTY;
  }

  onInit() {
    if (this.isDisabled()) {
      this.stream.write('Fetching dependencies...\n');
    }
  }

  /**
   * @param {HttpProgressEvent} progress
   * @protected
   */
  onProgress(progress) {
    const total = progress.finishedCount + progress.queuedCount;
    const text = `Fetching dependencies... Processed: ${total}`;

    this.stream.cursorTo(0);
    this.stream.clearLine(0);
    this.stream.write(text);
    this.stream.cursorTo(0);
  }

  onFinish() {
    this.stream.cursorTo(0);
    this.stream.clearLine(0);
  }
}

module.exports = StatProgressIndicator;
