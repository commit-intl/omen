const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  context: path.join(__dirname, 'example'),
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    './index',
  ],
  output: {
    path: path.join(__dirname, 'dist', 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {loader: 'babel'}
        ],
      }
    ]
  }
};