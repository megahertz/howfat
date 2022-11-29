'use strict';

module.exports = axiosQueuePlugin;

function axiosQueuePlugin(axios) {
  const queue = [];
  let activeSize = 0;
  let finishedSize = 0;

  axios.interceptors.request.use((config) => {
    return new Promise((resolve) => {
      queue.push(() => {
        activeSize += 1;
        resolve(config);
      });
      processQueue(config);
    });
  });

  axios.interceptors.response.use(
    (response) => {
      onTaskFinished(response.config);
      return Promise.resolve(response);
    },
    (error) => {
      onTaskFinished(error.config);
      return Promise.reject(error);
    },
  );

  function onTaskFinished(config) {
    activeSize -= 1;
    finishedSize += 1;
    processQueue(config);
  }

  function processQueue(config) {
    const connectionLimit = config?.connectionLimit || 10;
    if (connectionLimit > activeSize) {
      queue.shift()?.();
      config?.onStartFetching?.(config);
    }

    config?.onProcessQueue?.({
      activeSize,
      connectionLimit,
      finishedSize,
      queueSize: queue.length,
    });
  }
}
