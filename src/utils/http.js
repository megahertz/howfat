'use strict';

const httpReq         = require('http');
const httpsReq        = require('https');
const { PassThrough } = require('stream');

module.exports = {
  get,
};

/**
 * Fetch URI
 * @param {string} url
 * @param {module:http.RequestOptions} [options={}]
 * @return {Response}
 */
function get(url, options) {
  return new Response(createHttpStream(url, options));
}

class Response {
  constructor(stream) {
    /** @type {module:stream.internal.Readable} */
    this.stream = stream;
  }

  /**
   * @return {Promise<Buffer>}
   */
  async asBuffer() {
    const chunks = [];
    const stream = this.stream;

    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * @return {Promise<string>}
   */
  async asString() {
    const buffer = await this.asBuffer();
    return buffer.toString('utf8');
  }

  /**
   * @return {Promise<object>}
   */
  async asJson() {
    const content = await this.asString();
    return JSON.parse(content);
  }

  /**
   * @param {module:stream.internal.Writable} stream
   * @return {module:stream.internal.Writable}
   */
  pipe(stream) {
    return this.stream.pipe(stream);
  }

  /**
   * Implements thenable object
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   * @return {Promise<string>}
   */
  then(onFulfilled, onRejected = undefined) {
    return this.asString().then(onFulfilled, onRejected);
  }
}

/**
 * Create readable stream for remote url
 * @param {string} uri
 * @param {module:http.RequestOptions} [options={}]
 * @return {module:stream.internal.Readable}
 */
function createHttpStream(uri, options = {}) {
  const stream = new PassThrough();
  const http = uri.startsWith('https') ? httpsReq : httpReq;
  let isFinished = false;
  let responseInstance;

  const timeout = options.timeout;
  delete options.timeout;

  const request = http.get(uri, options, (res) => {
    const { statusCode } = res;
    responseInstance = res;

    if (statusCode === 301 || statusCode === 302) {
      if (res.headers.location) {
        createHttpStream(res.headers.location)
          .pipe(stream)
          .on('end', () => isFinished = true);
      } else {
        error(new Error(`Bad response of ${uri}: ${statusCode}`));
      }

      return;
    }

    if (statusCode !== 200) {
      error(new Error(`GET ${uri} returns status code ${statusCode}`));
      return;
    }

    res.pipe(stream);

    res.on('end', () => isFinished = true);
  });

  request.on('error', error);

  if (timeout) {
    timeout && setTimeout(() => {
      !isFinished && error(new Error(`GET ${uri} timeout`));
    }, timeout);
  }

  return stream;

  function error(e) {
    stream.emit('error', e);
    responseInstance && responseInstance.resume();
  }
}
