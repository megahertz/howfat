'use strict';

module.exports = axiosRetryPlugin;

function axiosRetryPlugin(axios) {
  axios.interceptors.response.use(null, async (error) => {
    const config = error.config;

    if (!config) {
      throw error;
    }

    const retryCount = config.retryCount || 0;
    const attemptMade = config.attemptMade || 0;

    const shouldRetry = attemptMade < retryCount
      && (!error.response || error.response.code >= 500);

    if (shouldRetry) {
      config.attemptMade = attemptMade + 1;
      config.transformRequest = [(data) => data];

      config.onRetry?.({
        code: error.code,
        error,
        message: error.message,
        responseCode: error.response?.code,
        url: config.url,
      });

      return new Promise((resolve) => {
        setTimeout(
          () => {
            resolve(axios(config));
            config?.onStartFetching?.(config);
          },
          exponentialDelay(config.attemptMade),
        );
      });
    }

    throw error;
  });
}

function exponentialDelay(retryNumber = 0, startDelay = 200) {
  const delay = 2 ** retryNumber * startDelay;
  const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
  return delay + randomSum;
}
