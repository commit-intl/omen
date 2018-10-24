const webpack = require('webpack');
const Server = require('webpack-dev-server');
const devConfig = require('./dev.config');


module.exports = function (config = {}) {
  try {
    return new Server(webpack({...devConfig, ...config}));
  } catch (err) {
    if (err.name === 'ValidationError') {
      log.error(colors.error(options.stats.colors, err.message));
      process.exit(1);
    }
    throw err;
  }
};