const webpack = require('webpack');
const Server = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');


const WebpackHelper = {

  createWebpack(env = 'dev', executionDir, config = {}) {
    const finalConfig = { ...webpackConfig(executionDir, env === 'prod'), ...config };
    return {
      config: finalConfig,
      compiler: webpack(finalConfig),
    }
  },

  DevServer: function (env = 'dev', executionDir, config = {}) {
    try {
      const webpack = WebpackHelper.createWebpack(env, executionDir, config);
      return new Server(webpack.compiler);
    } catch (err) {
      if (err.name === 'ValidationError') {
        log.error(colors.error(options.stats.colors, err.message));
        process.exit(1);
      }
      throw err;
    }
  }
};

module.exports = WebpackHelper;
