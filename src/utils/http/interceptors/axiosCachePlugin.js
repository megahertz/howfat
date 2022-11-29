'use strict';

module.exports = axiosCachePlugin;

function axiosCachePlugin(axios) {
  const cache = {};

  axios.interceptors.request.use((config) => {
    if (!cache[config.url] || config.responseType === 'stream') {
      return config;
    }

    return {
      ...config,
      adapter(cfg) {
        cfg.onCached?.({ url: cfg.url });
        return Promise.resolve(cache[cfg.url]);
      },
    };
  });

  axios.interceptors.response.use((response) => {
    if (response.config?.responseType !== 'stream') {
      cache[response.config.url] = response;
    }

    return response;
  });
}
