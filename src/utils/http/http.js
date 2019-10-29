'use strict';

const httpReq = require('http');
const httpsReq = require('https');
const { URL } = require('url');
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
  let responseInstance;

  const request = http.get(uri, options, (res) => {
    const { statusCode } = res;
    responseInstance = res;

    if (res.headers.location) {
      createHttpStream(new URL(res.headers.location, uri).href)
        .pipe(stream);
      return;
    }

    if (statusCode !== 200) {
      error(new Error(`GET ${uri} returns status code ${statusCode}`));
      return;
    }

    res.pipe(stream);
  });

  request
    .on('error', error)
    .on('timeout', () => {
      error(new Error(`Timeout error when requesting ${uri}`));
    });

  return stream;

  function error(e) {
    stream.emit('error', e);
    request.abort();
    responseInstance && responseInstance.resume();
  }
}
