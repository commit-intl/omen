const webpack = require('webpack');
const Server = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');


const WebpackHelper = {

  createWebpack(env = 'dev', executionDir, config = {}) {
    return webpack({ ...webpackConfig(executionDir, env === 'prod'), ...config })
  },

  DevServer: function (env = 'dev', executionDir, config = {}) {
    try {
      return new Server(WebpackHelper.createWebpack(env, executionDir, config));
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
