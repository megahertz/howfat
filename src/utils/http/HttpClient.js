'use strict';

const { default: Axios } = require('axios');
const { EventEmitter } = require('events');
const axiosCachePlugin = require('./interceptors/axiosCachePlugin');
const axiosQueuePlugin = require('./interceptors/axiosQueuePlugin');
const axiosRetryPlugin = require('./interceptors/axiosRetryPlugin');

/**
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

class HttpClient extends EventEmitter {
  /** @type {Axios} */
  #axios;

  /** @type {AxiosRequestConfig & { connectionLimit?, retryCount? }} */
  #config;

  /**
   * @param {AxiosRequestConfig & { connectionLimit?, retryCount? }} config
   */
  constructor(config = {}) {
    super();

    this.#axios = Axios.create();
    axiosCachePlugin(this.#axios);
    axiosQueuePlugin(this.#axios);
    axiosRetryPlugin(this.#axios);

    if (typeof config.proxy === 'string' && !process.env.HTTPS_PROXY) {
      process.env.HTTPS_PROXY = config.proxy;
    }

    this.#config = {
      connectionLimit: config.connectionLimit || 10,
      retryCount: config.retryCount || 5,
      timeout: 10_000,
      ...config,

      onRetry: ({ error, url }) => this.emit('error', { error, url }),

      onProcessQueue: ({ activeSize, finishedSize, queueSize }) => {
        this.emit('progress', {
          finishedCount: finishedSize,
          queuedCount: queueSize + activeSize,
        });
      },

      onStartFetching: ({ url }) => this.emit('start', { url }),
    };
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig} config
   * @return {object}
   */
  async get(url, config = {}) {
    const response = await this.request({ method: 'GET', url, ...config });
    return response.data;
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig} config
   * @return {Promise<Readable>}
   */
  async getStream(url, config = {}) {
    const response = await this.request({
      method: 'GET',
      responseType: 'stream',
      url,
      ...config,
    });
    return response.data;
  }

  /**
   * @param {AxiosRequestConfig} config
   * @return {Promise<{ headers: object, data: any, status: number }>}
   */
  async request(config) {
    const mergedConfig = {
      ...this.#config,
      ...config,
    };

    try {
      const response = await this.#axios.request(mergedConfig);

      this.emit('finish', {
        response: response.data,
        status: response.status,
        url: config.url,
      });

      return {
        data: response.data,
        headers: response.headers,
        status: response.status,
      };
    } catch (error) {
      this.emit('error', {
        error,
        url: config.url,
      });
      throw error;
    }
  }
}

module.exports = HttpClient;
